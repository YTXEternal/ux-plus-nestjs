import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Interval, SchedulerRegistry } from '@nestjs/schedule';
import * as os from 'os';
import { toNumber } from '@/tools';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pidusage = require('pidusage');

/**
 * CPU 保护算法：增强型动态请求丢弃
 *
 * @export
 * @class CpuOverloadProtectionService
 * @implements {OnModuleInit}
 * @implements {OnModuleDestroy}
 */
@Injectable()
export class CpuOverloadProtectionService
  implements OnModuleInit, OnModuleDestroy
{
  private baseProbability = 0.7; // 基础丢弃概率 (0~1)
  private maxCpuThreshold = 0; // 将动态计算
  private overloadTimes = 0;
  private currentCpuPercentage = 0; // EMA 平滑后的值
  private readonly alpha = 0.5; // EMA 平滑因子 (0.5 意味着在新旧值之间平衡)
  private isOverloaded = false;

  private cpuMonitorFailureCount = 0; // CPU 监控连续失败计数
  private readonly maxCpuMonitorFailures = 10; // 抑制日志前的最大失败次数

  private logger = new Logger(CpuOverloadProtectionService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit() {
    this.baseProbability = toNumber(
      this.configService.get('CPU_BASE_PROBABILITY') || '0.7',
    );

    // 动态阈值计算
    // 如果未配置，默认为总 CPU 容量的 80%
    const cpuCount = os.cpus().length;
    const configuredThreshold = this.configService.get('CPU_MAX_THRESHOLD');

    if (configuredThreshold) {
      this.maxCpuThreshold = toNumber(configuredThreshold);
    } else {
      this.maxCpuThreshold = cpuCount * 100 * 0.8;
    }

    this.logger.log(
      `CPU 保护服务已初始化。阈值: ${this.maxCpuThreshold.toFixed(
        0,
      )}% (核心数: ${cpuCount})`,
    );
  }

  // 启动 CPU 监控任务
  @Interval('CPUSTATE', 3000)
  async startCpuMonitor() {
    let isMemoryOverload = false;
    let heapUsageRatio = 0;

    // 1. 内存检查 (始终运行，独立于 CPU 检查)
    try {
      const memory = process.memoryUsage();
      heapUsageRatio = memory.heapUsed / memory.heapTotal;
      isMemoryOverload = heapUsageRatio > 0.85;
    } catch (err) {
      // 内存检查很少失败，但为了安全起见还是加上
      this.logger.error('检查内存使用情况失败', err);
    }

    // 2. CPU 检查 (在某些系统上可能会失败)
    try {
      const stats = await pidusage(process.pid);

      // 成功时重置失败计数
      if (this.cpuMonitorFailureCount > 0) {
        this.cpuMonitorFailureCount = 0;
        this.logger.log('CPU 监控已恢复');
      }

      // 应用 EMA (指数移动平均) 来平滑 CPU 峰值
      if (this.currentCpuPercentage === 0) {
        this.currentCpuPercentage = stats.cpu;
      } else {
        this.currentCpuPercentage =
          this.currentCpuPercentage * (1 - this.alpha) + stats.cpu * this.alpha;
      }
    } catch (err) {
      this.cpuMonitorFailureCount++;

      // 错误日志逻辑:
      // - 前 3 次失败: Error 级别 (提醒开发者)
      // - 4-10 次失败: Warn 级别 (减少噪音)
      // - >10 次失败: 抑制日志 (防止刷屏)
      if (this.cpuMonitorFailureCount <= 3) {
        this.logger.error(
          `获取 CPU 使用率失败 (第 ${this.cpuMonitorFailureCount} 次尝试)`,
          err instanceof Error ? err.stack : err,
        );
      } else if (this.cpuMonitorFailureCount <= this.maxCpuMonitorFailures) {
        this.logger.warn(
          `CPU 监控失败中... (第 ${this.cpuMonitorFailureCount} 次尝试)`,
        );
      }
      // 如果超过 maxCpuMonitorFailures，我们保持沉默以避免日志刷屏
      // 但我们仍然计数以知道它坏了
    }

    // 3. 过载逻辑 (组合)
    // 如果 CPU 监控损坏，我们仅依赖内存
    // 注意: 如果 CPU 未知 (损坏)，currentCpuPercentage 保持旧值。
    // 如果 CPU 检查失败时间过长，我们可能希望使其衰减，但保留最后已知值比 0 更安全。
    if (this.currentCpuPercentage > this.maxCpuThreshold || isMemoryOverload) {
      this.overloadTimes = Math.min(this.overloadTimes + 1, 50); // 上限 50 次

      if (!this.isOverloaded) {
        this.isOverloaded = true;
        this.logger.warn(
          `检测到系统过载! CPU: ${this.currentCpuPercentage.toFixed(
            1,
          )}%, 内存: ${(heapUsageRatio * 100).toFixed(1)}%`,
        );
      }
    } else {
      this.overloadTimes = Math.max(0, this.overloadTimes - 1);

      if (this.isOverloaded && this.overloadTimes === 0) {
        this.isOverloaded = false;
        this.logger.log(
          `系统已恢复。CPU: ${this.currentCpuPercentage.toFixed(1)}%`,
        );
      }
    }
  }

  /**
   * 根据系统负载确定是否应丢弃当前请求。
   * true 表示丢弃，false 表示允许。
   *
   * @returns {boolean}
   */
  shouldDropRequest(): boolean {
    // 快速路径: 如果系统健康，允许所有请求
    if (
      !this.isOverloaded &&
      this.currentCpuPercentage <= this.maxCpuThreshold
    ) {
      return false;
    }

    // 因子 1: 过载持续时间 (0 ~ 1)
    // 约 1 分钟后达到最大权重 (20 个间隔 * 3秒)
    const timeFactor = Math.min(this.overloadTimes / 20, 1);

    // 因子 2: 负载严重程度
    // 例如: 如果使用率是阈值的 120%，则因子为 1.2
    const loadFactor =
      this.currentCpuPercentage > this.maxCpuThreshold
        ? this.currentCpuPercentage / this.maxCpuThreshold
        : 1;

    // 计算最终概率
    // 如果过载持续很长时间 (timeFactor=1) 且负载很高 (loadFactor=1.5)，
    // 概率 = 0.7 * 1 * 1.5 = 1.05 (100% 丢弃)
    const probability = this.baseProbability * timeFactor * loadFactor;

    return Math.random() < Math.min(probability, 1);
  }

  onModuleDestroy() {
    try {
      const job = this.schedulerRegistry.getInterval('CPUSTATE');
      if (job) {
        clearInterval(job);
        this.schedulerRegistry.deleteInterval('CPUSTATE');
      }
    } catch (e) {
      // Interval 可能不存在，忽略
    }
  }
}

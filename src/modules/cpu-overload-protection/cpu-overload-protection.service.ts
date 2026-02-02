import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Interval, SchedulerRegistry } from '@nestjs/schedule';
import pidusage from 'pidusage';
import * as os from 'os';
import { toNumber } from '@/tools';

/**
 * CPU Protection Algorithm: Enhanced Dynamic Request Dropping
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
  private baseProbability = 0.7; // Base Dropping Probability (0~1)
  private maxCpuThreshold = 0; // Will be calculated dynamically
  private overloadTimes = 0;
  private currentCpuPercentage = 0; // EMA smoothed value
  private readonly alpha = 0.5; // EMA smoothing factor (0.5 means balanced between new and old)
  private isOverloaded = false;

  private logger = new Logger(CpuOverloadProtectionService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit() {
    this.baseProbability = toNumber(
      this.configService.get('CPU_BASE_PROBABILITY') || '0.7',
    );

    // Dynamic threshold calculation
    // Default to 80% of total CPU capacity if not configured
    const cpuCount = os.cpus().length;
    const configuredThreshold = this.configService.get('CPU_MAX_THRESHOLD');

    if (configuredThreshold) {
      this.maxCpuThreshold = toNumber(configuredThreshold);
    } else {
      this.maxCpuThreshold = cpuCount * 100 * 0.8;
    }

    this.logger.log(
      `CPU Protection Service initialized. Threshold: ${this.maxCpuThreshold.toFixed(
        0,
      )}% (Cores: ${cpuCount})`,
    );
  }

  // Start CPU monitoring task
  @Interval('CPUSTATE', 3000)
  async startCpuMonitor() {
    try {
      const stats = await pidusage(process.pid);

      // Apply EMA (Exponential Moving Average) to smooth out CPU spikes
      if (this.currentCpuPercentage === 0) {
        this.currentCpuPercentage = stats.cpu;
      } else {
        this.currentCpuPercentage =
          this.currentCpuPercentage * (1 - this.alpha) + stats.cpu * this.alpha;
      }

      // Memory protection check (Heap Usage > 85%)
      const memory = process.memoryUsage();
      const heapUsageRatio = memory.heapUsed / memory.heapTotal;
      const isMemoryOverload = heapUsageRatio > 0.85;

      if (
        this.currentCpuPercentage > this.maxCpuThreshold ||
        isMemoryOverload
      ) {
        this.overloadTimes = Math.min(this.overloadTimes + 1, 50); // Cap at 50 times

        if (!this.isOverloaded) {
          this.isOverloaded = true;
          this.logger.warn(
            `System Overload Detected! CPU: ${this.currentCpuPercentage.toFixed(
              1,
            )}%, Mem: ${(heapUsageRatio * 100).toFixed(1)}%`,
          );
        }
      } else {
        this.overloadTimes = Math.max(0, this.overloadTimes - 1);

        if (this.isOverloaded && this.overloadTimes === 0) {
          this.isOverloaded = false;
          this.logger.log(
            `System Recovered. CPU: ${this.currentCpuPercentage.toFixed(1)}%`,
          );
        }
      }
    } catch (err) {
      this.logger.error('Failed to obtain CPU usage rate', err);
    }
  }

  /**
   * Determine if the current request should be dropped based on system load.
   * true means drop, false means allow.
   *
   * @returns {boolean}
   */
  shouldDropRequest(): boolean {
    // Fast path: if system is healthy, allow all requests
    if (
      !this.isOverloaded &&
      this.currentCpuPercentage <= this.maxCpuThreshold
    ) {
      return false;
    }

    // Factor 1: Duration of overload (0 ~ 1)
    // Reaches max weight after ~1 minute (20 intervals * 3s)
    const timeFactor = Math.min(this.overloadTimes / 20, 1);

    // Factor 2: Severity of load
    // e.g. If usage is 120% of threshold, factor is 1.2
    const loadFactor =
      this.currentCpuPercentage > this.maxCpuThreshold
        ? this.currentCpuPercentage / this.maxCpuThreshold
        : 1;

    // Calculate final probability
    // If overload persists for long (timeFactor=1) and load is high (loadFactor=1.5),
    // Probability = 0.7 * 1 * 1.5 = 1.05 (100% drop)
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
      // Interval might not exist, ignore
    }
  }
}

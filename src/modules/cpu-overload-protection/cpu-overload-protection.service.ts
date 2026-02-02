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

  private cpuMonitorFailureCount = 0; // Consecutive failure count for CPU monitoring
  private readonly maxCpuMonitorFailures = 10; // Max failures before suppressing logs

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
    let isMemoryOverload = false;
    let heapUsageRatio = 0;

    // 1. Memory Check (Always run this, independent of CPU check)
    try {
      const memory = process.memoryUsage();
      heapUsageRatio = memory.heapUsed / memory.heapTotal;
      isMemoryOverload = heapUsageRatio > 0.85;
    } catch (err) {
      // Memory check rarely fails, but good to be safe
      this.logger.error('Failed to check memory usage', err);
    }

    // 2. CPU Check (Might fail on some systems)
    try {
      const stats = await pidusage(process.pid);

      // Reset failure count on success
      if (this.cpuMonitorFailureCount > 0) {
        this.cpuMonitorFailureCount = 0;
        this.logger.log('CPU monitoring recovered');
      }

      // Apply EMA (Exponential Moving Average) to smooth out CPU spikes
      if (this.currentCpuPercentage === 0) {
        this.currentCpuPercentage = stats.cpu;
      } else {
        this.currentCpuPercentage =
          this.currentCpuPercentage * (1 - this.alpha) + stats.cpu * this.alpha;
      }
    } catch (err) {
      this.cpuMonitorFailureCount++;

      // Log error logic:
      // - First 3 failures: Error level (to alert dev)
      // - 4-10 failures: Warn level (reduced noise)
      // - >10 failures: Suppress logs (prevent flooding)
      if (this.cpuMonitorFailureCount <= 3) {
        this.logger.error(
          `Failed to obtain CPU usage rate (Attempt ${this.cpuMonitorFailureCount})`,
          err instanceof Error ? err.stack : err,
        );
      } else if (this.cpuMonitorFailureCount <= this.maxCpuMonitorFailures) {
        this.logger.warn(
          `CPU monitoring failing... (Attempt ${this.cpuMonitorFailureCount})`,
        );
      }
      // If > maxCpuMonitorFailures, we stay silent to avoid log flooding
      // But we still count up to know it's broken
    }

    // 3. Overload Logic (Combined)
    // If CPU monitor is broken, we rely solely on memory
    // Note: If CPU is unknown (broken), currentCpuPercentage keeps old value.
    // We might want to decay it if CPU check fails for too long, but keeping last known is safer than 0.
    if (this.currentCpuPercentage > this.maxCpuThreshold || isMemoryOverload) {
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

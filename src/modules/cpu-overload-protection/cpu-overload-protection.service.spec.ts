import { Test, TestingModule } from '@nestjs/testing';
import { CpuOverloadProtectionService } from './cpu-overload-protection.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import pidusage = require('pidusage');
import * as os from 'os';
import { ScheduleModule } from '@nestjs/schedule';

// 修正 Mock 方式：pidusage 是一个函数
jest.mock('pidusage', () => jest.fn());

jest.mock('os', () => {
  const originalOs = jest.requireActual('os');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...originalOs,
    cpus: jest.fn().mockReturnValue(new Array(8).fill({})), // 模拟 8 核 CPU
  };
});

describe('CpuOverloadProtectionService', () => {
  let service: CpuOverloadProtectionService;
  let loggerErrorSpy: jest.SpyInstance;
  let loggerWarnSpy: jest.SpyInstance;

  beforeAll(async () => {
    const configServiceMock = {
      get: jest.fn((key) => {
        if (key === 'CPU_BASE_PROBABILITY') return '0.7';
        if (key === 'CPU_MAX_THRESHOLD') return undefined; // 测试动态计算
        return null;
      }),
    };

    loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    loggerWarnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    jest.spyOn(Logger.prototype, 'log').mockImplementation();

    // Mock memory usage
    jest.spyOn(process, 'memoryUsage').mockReturnValue({
      heapUsed: 100,
      heapTotal: 1000,
      rss: 2000,
      external: 0,
      arrayBuffers: 0,
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [ScheduleModule.forRoot()],
      providers: [
        CpuOverloadProtectionService,
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    service = module.get<CpuOverloadProtectionService>(
      CpuOverloadProtectionService,
    );

    // 手动调用 init
    service.onModuleInit();
  });

  beforeEach(() => {
    // 重置服务内部状态，确保每个测试用例隔离
    service['currentCpuPercentage'] = 0;
    service['overloadTimes'] = 0;
    service['isOverloaded'] = false;
    service['cpuMonitorFailureCount'] = 0;
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    // 8 cores * 100 * 0.8 = 640
    expect(service['maxCpuThreshold']).toBe(640);
  });

  describe('startCpuMonitor', () => {
    it('should update overloadTimes and apply EMA when CPU usage is above threshold', async () => {
      // 第一次读数: 800
      (pidusage as unknown as jest.Mock).mockResolvedValueOnce({
        cpu: 800,
      });
      await service.startCpuMonitor();

      // EMA init: 800
      expect(service['currentCpuPercentage']).toBe(800);
      expect(service['overloadTimes']).toBe(1);
      expect(loggerWarnSpy).toHaveBeenCalled(); // 应该触发警告

      // 第二次读数: 1000
      (pidusage as unknown as jest.Mock).mockResolvedValueOnce({
        cpu: 1000,
      });
      await service.startCpuMonitor();

      // EMA: 800 * 0.5 + 1000 * 0.5 = 900
      expect(service['currentCpuPercentage']).toBe(900);
      expect(service['overloadTimes']).toBe(2);
    });

    it('should handle CPU monitor failure gracefully', async () => {
      (pidusage as unknown as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to get CPU'),
      );
      await service.startCpuMonitor();

      // 这里需要等待下一个 tick 或者 promise 拒绝被捕获
      // 实际上 startCpuMonitor 内部已经 catch 了，但 jest mock rejected value 可能会有一些时序问题
      // 让我们再次确认 pidusage 是否被正确调用
      expect(pidusage).toHaveBeenCalled();

      expect(loggerErrorSpy).toHaveBeenCalled();
      expect(service['cpuMonitorFailureCount']).toBe(1);
    });

    it('should suppress logs after multiple failures', async () => {
      service['cpuMonitorFailureCount'] = 11;
      (pidusage as unknown as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to get CPU'),
      );
      await service.startCpuMonitor();

      expect(loggerErrorSpy).not.toHaveBeenCalled();
      expect(loggerWarnSpy).not.toHaveBeenCalled();
      expect(service['cpuMonitorFailureCount']).toBe(12);
    });

    it('should trigger overload on memory usage high even if CPU check fails', async () => {
      // CPU 失败
      (pidusage as unknown as jest.Mock).mockRejectedValueOnce(
        new Error('Failed'),
      );

      // 内存高 (900/1000 = 0.9 > 0.85)
      jest.spyOn(process, 'memoryUsage').mockReturnValue({
        heapUsed: 900,
        heapTotal: 1000,
        rss: 2000,
        external: 0,
        arrayBuffers: 0,
      });

      // 之前状态
      service['overloadTimes'] = 2;

      await service.startCpuMonitor();

      // CPU 失败计数增加
      expect(service['cpuMonitorFailureCount']).toBeGreaterThan(0);
      // 依然检测到过载 (2 -> 3)
      expect(service['overloadTimes']).toBe(3);
    });

    it('should decrement overloadTimes when system recovers', async () => {
      // CPU 低, 内存低
      (pidusage as unknown as jest.Mock).mockResolvedValueOnce({
        cpu: 100,
      });
      jest.spyOn(process, 'memoryUsage').mockReturnValue({
        heapUsed: 100,
        heapTotal: 1000,
        rss: 2000,
        external: 0,
        arrayBuffers: 0,
      });

      // 重置状态模拟
      service['currentCpuPercentage'] = 200; // 让 EMA 慢慢降下来
      service['overloadTimes'] = 5;

      await service.startCpuMonitor();

      // EMA: 200 * 0.5 + 100 * 0.5 = 150
      expect(service['currentCpuPercentage']).toBe(150);
      // overloadTimes 减少
      expect(service['overloadTimes']).toBe(4);
    });
  });

  describe('shouldDropRequest', () => {
    it('should return false when system is healthy', () => {
      service['isOverloaded'] = false;
      service['currentCpuPercentage'] = 500;
      expect(service.shouldDropRequest()).toBe(false);
    });

    it('should calculate probability when overloaded', () => {
      service['isOverloaded'] = true;
      service['currentCpuPercentage'] = 800; // > 640
      service['overloadTimes'] = 20; // timeFactor = 1

      // Mock random to return 0 (always true if prob > 0)
      const originalRandom = Math.random;
      Math.random = () => 0.1;

      // Prob = 0.7 * 1 * (800/640=1.25) = 0.875
      // 0.1 < 0.875 => true
      expect(service.shouldDropRequest()).toBe(true);

      Math.random = () => 0.9;
      // 0.9 > 0.875 => false
      expect(service.shouldDropRequest()).toBe(false);

      Math.random = originalRandom;
    });
  });
});

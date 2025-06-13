import { Test, TestingModule } from '@nestjs/testing';
import { CpuOverloadProtectionService } from './cpu-overload-protection.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as pidusage from 'pidusage';
import { ScheduleModule } from '@nestjs/schedule';

jest.mock('pidusage', () => jest.fn());

describe('CpuOverloadProtectionService', () => {
  let service: CpuOverloadProtectionService;
  let loggerErrorSpy: jest.SpyInstance;

  beforeAll(async () => {
    const configServiceMock = {
      get: jest
        .fn()
        .mockReturnValueOnce('0.7') // CPU_BASE_PROBABILITY
        .mockReturnValueOnce('640'), // CPU_MAX_THRESHOLD
    };

    loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();

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
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    // service.destory();
    jest.clearAllTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('startCpuMonitor', () => {
    it('should update overloadTimes when CPU usage is above threshold', async () => {
      (pidusage as unknown as jest.Mock).mockResolvedValueOnce({ cpu: 800 });

      await service.startCpuMonitor();

      expect(service['overloadTimes']).toBe(1);
      expect(service['currentCpuPercentage']).toBe(800);
    });

    it('should decrement overloadTimes when CPU usage is below threshold', async () => {
      service['overloadTimes'] = 5;

      (pidusage as unknown as jest.Mock).mockResolvedValueOnce({ cpu: 300 });

      await service.startCpuMonitor();

      expect(service['overloadTimes']).toBe(4);
      expect(service['currentCpuPercentage']).toBe(300);
    });

    it('should log error if pidusage fails', async () => {
      (pidusage as unknown as jest.Mock).mockRejectedValueOnce(
        new Error('Test error'),
      );

      await service.startCpuMonitor();

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Failed to obtain CPU usage rate',
        expect.any(Error),
      );
    });
  });

  describe('shouldDropRequest', () => {
    it('should return false when CPU is below threshold', () => {
      service['currentCpuPercentage'] = 500;
      const result = service.shouldDropRequest();
      expect(result).toBe(false);
    });

    it('should return a boolean based on calculated probability when CPU is above threshold', () => {
      service['currentCpuPercentage'] = 800;
      service['overloadTimes'] = 50;

      const originalRandom = Math.random;
      Math.random = () => 0.5;

      const result = service.shouldDropRequest();

      expect(typeof result).toBe('boolean');

      Math.random = originalRandom;
    });

    it('should return true when random falls within the calculated probability', () => {
      service['currentCpuPercentage'] = 800;
      service['overloadTimes'] = 50;

      const originalRandom = Math.random;
      Math.random = () => 0.9;

      const result = service.shouldDropRequest();
      expect(result).toBe(false);

      Math.random = () => 0.1;
      const result2 = service.shouldDropRequest();
      expect(result2).toBe(true);

      Math.random = originalRandom;
    });
  });
});

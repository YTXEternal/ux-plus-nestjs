import { RequestTimeoutException } from '@nestjs/common';
import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { lastValueFrom, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TIMEOUT_KEY } from './timeout.decorator';
import { TimeoutInterceptor } from './timeout.interceptor';

type Mocked<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? jest.Mock : T[K];
};

const createExecutionContext = (): ExecutionContext =>
  ({
    getHandler: () => () => void 0,
    getClass: () => class TestController {},
  }) as unknown as ExecutionContext;

describe('TimeoutInterceptor', () => {
  let reflector: Mocked<{
    getAllAndOverride: (...args: unknown[]) => number | undefined;
  }>;
  let configService: Mocked<{
    get: (key: string, defaultValue: number) => number;
  }>;

  const buildInterceptor = () =>
    new TimeoutInterceptor(reflector as any, configService as any);

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(() => undefined),
    };
    configService = {
      get: jest.fn((key: string, defaultValue: number) => {
        if (key === 'APP_TIMEOUT') return defaultValue;
        return defaultValue;
      }),
    };
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it('should use decorator timeout over global timeout', async () => {
    jest.useFakeTimers();

    reflector.getAllAndOverride.mockImplementation((key: string) => {
      if (key === TIMEOUT_KEY) return 10;
      return undefined;
    });
    configService.get.mockImplementation(
      (key: string, defaultValue: number) => {
        if (key === 'APP_TIMEOUT') return 9999;
        return defaultValue;
      },
    );

    const interceptor = buildInterceptor();
    const ctx = createExecutionContext();
    const next: CallHandler = {
      handle: () => of('ok').pipe(delay(20)),
    };

    const promise = lastValueFrom(interceptor.intercept(ctx, next));
    const assertion = expect(promise).rejects.toBeInstanceOf(
      RequestTimeoutException,
    );
    await jest.advanceTimersByTimeAsync(11);
    await assertion;
  });

  it('should use global timeout when decorator timeout is missing', async () => {
    jest.useFakeTimers();

    reflector.getAllAndOverride.mockImplementation((key: string) => {
      if (key === TIMEOUT_KEY) return undefined;
      return undefined;
    });
    configService.get.mockImplementation(
      (key: string, defaultValue: number) => {
        if (key === 'APP_TIMEOUT') return 10;
        return defaultValue;
      },
    );

    const interceptor = buildInterceptor();
    const ctx = createExecutionContext();
    const next: CallHandler = {
      handle: () => of('ok').pipe(delay(20)),
    };

    const promise = lastValueFrom(interceptor.intercept(ctx, next));
    const assertion = expect(promise).rejects.toBeInstanceOf(
      RequestTimeoutException,
    );
    await jest.advanceTimersByTimeAsync(11);
    await assertion;
  });

  it('should pass through non-timeout error', async () => {
    const interceptor = buildInterceptor();
    const ctx = createExecutionContext();
    const next: CallHandler = {
      handle: () => throwError(() => new Error('boom')),
    };

    await expect(
      lastValueFrom(interceptor.intercept(ctx, next)),
    ).rejects.toThrow('boom');
  });
});

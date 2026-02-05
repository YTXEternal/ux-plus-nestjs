import { TransformResponseInterceptor } from './transform-response.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';

interface TestResponse {
  message: string;
}

describe('TransformResponseInterceptor', () => {
  let interceptor: TransformResponseInterceptor<TestResponse>;
  let configService: ConfigService;

  beforeEach(() => {
    configService = {
      get: jest.fn(),
    } as unknown as ConfigService;
    interceptor = new TransformResponseInterceptor<TestResponse>(configService);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should transform response data', (done) => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          url: '/test',
        }),
      }),
    } as unknown as ExecutionContext;

    const mockCallHandler: CallHandler<TestResponse> = {
      handle: () => of({ message: 'test data' }),
    };

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (result) => {
        expect(result).toEqual({ message: 'test data' });
        done();
      },
    });
  });
});

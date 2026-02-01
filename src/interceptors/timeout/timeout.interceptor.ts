import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { TIMEOUT_KEY } from './timeout.decorator';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 1. 获取装饰器上的超时设置 (优先处理 handler，其次 class)
    const decoratorTimeout = this.reflector.getAllAndOverride<number>(
      TIMEOUT_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 2. 获取全局配置的超时时间，默认 5000ms
    const globalTimeout = this.configService.get<number>('APP_TIMEOUT', 5000);

    // 3. 确定最终超时时间 (装饰器 > 全局)
    // 确保转换为数字，环境变量读取出来可能是字符串
    const timeoutValue = Number(decoratorTimeout ?? globalTimeout);

    return next.handle().pipe(
      timeout(timeoutValue),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(
            () =>
              new RequestTimeoutException(
                `Request timeout after ${timeoutValue}ms`,
              ),
          );
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return throwError(() => err);
      }),
    );
  }
}

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import intercept from './intercept';
import type { Method } from './intercept';
import { ApiResponse } from '@/dto/api-response';
/**
 * 响应数据转换拦截器
 *
 * 用于拦截接口响应，获取请求信息，并对响应数据进行统一转换处理
 */
@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, T> {
  constructor(private readonly configService: ConfigService) {}

  /**
   * 拦截方法
   * @param context 执行上下文
   * @param next 调用处理程序
   * @returns 处理后的响应流
   */
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const request = context.switchToHttp().getRequest<Request>();

    // 获取请求方法和请求路径
    const { method, url } = request;
    console.log('method', method, 'url', url, intercept);
    const isBootUp =
      this.configService.get<'Y' | 'N'>('INTERCEPTOR_TRANSFORM_RESPONSE') ===
      'N';
    // TODO: 用户可以在此处添加基于 method 和 url 的特定逻辑
    // console.log(`[TransformResponse] Request Method: ${method}, URL: ${url}`);

    // 示例：使用 ConfigService 获取配置
    // const someConfig = this.configService.get<string>('SOME_CONFIG');
    // 如果是N则不会启动拦截器
    if (isBootUp) {
      return next.handle();
    }
    const isTrue = !(url in intercept && method in intercept[url]);
    console.log('result', method, url, intercept, isTrue);

    if (isTrue) return next.handle();
    return next.handle().pipe(
      map((result: any) => {
        // 响应数据转换
        if (Array.isArray(result.data)) {
          result.data = result.data.map((item) =>
            this.transformData(item, method as Method, url),
          );
        } else {
          result.data = this.transformData(result.data, method as Method, url);
        }

        const isTransformStructure =
          this.configService.get<'Y' | 'N'>('APIRESPONSE_IS_TRANSFORM') === 'Y';
        if (!isTransformStructure) return result as T;
        return this.isTransformStructure(result);
      }),
    );
  }

  /**
   * 数据转换逻辑
   * @param data 原始响应数据
   * @param method 请求方法
   * @param url 请求路径
   * @returns 转换后的数据
   */
  private transformData(data: T, method: Method, url: string): T {
    // 预留给用户的实现区域
    // 你可以在这里编写具体的转换逻辑
    const transformClass = intercept[url][method]!;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return plainToClass(transformClass, data, {
      excludeExtraneousValues: true,
    });
  }
  private isTransformStructure(data: any): T {
    data.msg = data.message;

    const code = data.code as number;

    const condition = [
      {
        pattern: (code: number) => true,
        fn() {
          return code + '';
        },
      },
    ];

    data.code = condition.find((v) => v.pattern(code))?.fn();
    delete data.message;
    return data as T;
  }
}

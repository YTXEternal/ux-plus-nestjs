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
    if (!(url in intercept && method in intercept[url])) return next.handle();
    return next.handle().pipe(
      map((result: any) => {
        // 在这里进行响应数据的转换
        // data 是控制器返回的原始数据

        // 示例：你可以在这里根据 method 或 url 对 data 进行加工
        // if (url.includes('/api/some-path')) { ... }
        console.log('result', result);
        // 当前直接返回原始数据，具体转换逻辑由用户实现
        result.data = this.transformData(result.data, method as Method, url);
        return result as T;
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
    console.log('transformClass', transformClass, url, method);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return plainToClass(transformClass, data, {
      excludeExtraneousValues: true,
    });
  }
}

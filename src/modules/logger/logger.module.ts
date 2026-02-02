import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { EnvConfigModule } from '../env-config/env-config.module';

/**
 * 日志模块
 *
 * 基于 `nestjs-pino` 为应用提供统一的 HTTP 日志能力，并为每个请求生成/透传 `X-Request-Id`。
 * 对外导出 `nestjs-pino` 的 `LoggerModule`，供其他模块注入使用。
 *
 * @export
 * @class LoggerModule
 * @typedef {LoggerModule}
 */
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [EnvConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          pinoHttp: {
            genReqId: (req, res) => {
              const existingId = req.headers['x-request-id'];
              const id =
                (Array.isArray(existingId) ? existingId[0] : existingId) ||
                uuidv4();
              res.setHeader('X-Request-Id', id);
              return id;
            },
            transport: {
              targets: [
                configService.get('NODE_ENV') !== 'production'
                  ? {
                      target: 'pino-pretty',
                      options: {
                        translateTime: 'SYS:standard',
                      },
                    }
                  : undefined,
                {
                  target: 'pino/file',
                  options: {
                    destination: './logs/app.log',
                    mkdir: true,
                  },
                },
              ].filter(Boolean) as any,
            },
          },
        };
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}

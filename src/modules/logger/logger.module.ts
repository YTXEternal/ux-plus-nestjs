import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { EnvConfigModule } from '../env-config/env-config.module';

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

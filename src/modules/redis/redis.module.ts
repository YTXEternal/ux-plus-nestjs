import { Module, Global } from '@nestjs/common';
import {
  RedisModule as NestRedisModule,
  getRedisConnectionToken,
} from '@nestjs-modules/ioredis';
import { RedisService } from './redis.service';
import { EnvConfigModule } from '@/modules/env-config/env-config.module';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

const isRedisBootUp = process.env.REDIS_BOOT_UP === 'true';

@Global()
@Module({
  imports: [
    ...(isRedisBootUp
      ? [
          NestRedisModule.forRootAsync({
            imports: [EnvConfigModule],
            useFactory(configService: ConfigService) {
              return {
                type: 'single',
                url: `redis://${configService.get('REDIS_HOST')}:${+configService.get('REDIS_PORT')!}`,
                // options: {
                //   // host: configService.get('REDIS_HOST'),
                //   // port: +configService.get('REDIS_PORT')!,
                //   host: '127.0.0.1',
                //   port: 6379,
                // },
              };
            },
            inject: [ConfigService],
          }),
        ]
      : []),
  ],
  providers: [
    RedisService,
    ...(!isRedisBootUp
      ? [
          {
            provide: getRedisConnectionToken('default'),
            useValue: {
              get: () => Promise.resolve(null),
              set: () => Promise.resolve('OK'),
              del: () => Promise.resolve(1),
              keys: () => Promise.resolve([]),
            },
          },
        ]
      : []),
  ],
  exports: [RedisService],
})
export class RedisModule {}

import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { EnvConfigModule } from '@/modules/env-config/env-config.module';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

/**
 * MongoDB 数据库模块
 *
 * 通过 `@nestjs/mongoose` 初始化 MongoDB 连接：
 * - 根据 `NODE_ENV` 读取 `.env.${NODE_ENV}`（不存在则回退到 `.env`），并允许 `process.env` 覆盖
 * - 当 `MONGODB_BOOT_UP !== 'true'` 时，不创建连接（仅返回 module）
 * - 当 `MONGODB_BOOT_UP === 'true'` 时，建立连接并导出 `MongooseModule`
 *
 * @export
 * @class MongodbModule
 * @typedef {MongodbModule}
 */
@Module({})
export class MongodbModule {
  static register(): DynamicModule {
    const nodeEnv = process.env.NODE_ENV || 'development';
    const envFile = `.env.${nodeEnv}`;
    const envPath = path.resolve(process.cwd(), envFile);
    const defaultEnvPath = path.resolve(process.cwd(), '.env');

    let config: any = {};
    if (fs.existsSync(envPath)) {
      config = dotenv.parse(fs.readFileSync(envPath));
    } else if (fs.existsSync(defaultEnvPath)) {
      config = dotenv.parse(fs.readFileSync(defaultEnvPath));
    }

    // Merge process.env to allow override
    const finalEnv = { ...config, ...process.env };

    const shouldBoot = finalEnv.MONGODB_BOOT_UP === 'true';

    if (!shouldBoot) {
      return {
        module: MongodbModule,
      };
    }

    return {
      module: MongodbModule,
      imports: [
        MongooseModule.forRootAsync({
          imports: [EnvConfigModule],
          useFactory(configService: ConfigService) {
            const r: MongooseModuleFactoryOptions = {
              user: configService.get('MONGODB_USERNAME'),
              pass: configService.get('MONGODB_PASSWORD'),
              autoIndex: true,
              autoCreate: true,
              uri: `mongodb://${configService.get('MONGODB_HOST')}:${configService.get('MONGODB_PORT')}`,
              authSource: 'admin',
              dbName: configService.get('MONGODB_DATABASE'),
            };
            return r;
          },
          inject: [ConfigService],
        }),
      ],
      exports: [MongooseModule],
    };
  }
}

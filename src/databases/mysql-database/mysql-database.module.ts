import { DynamicModule, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  User,
  Role,
  Menu,
  Dept,
  DictType,
  DictData,
  OperLog,
  Logininfor,
  UserRole,
  RoleMenu,
  UserDept,
  File,
} from './model';
import { ConfigService } from '@nestjs/config';
import { EnvConfigModule } from '@/modules/env-config/env-config.module';
import { getEnvPaths } from '@/tools';
import * as dotenv from 'dotenv';

/**
 * MySQL 数据库模块
 *
 * 通过 `@nestjs/sequelize` 初始化 MySQL 连接并注册业务模型。
 * - 当 `MYSQL_BOOT_UP !== 'true'` 时，不加载任何数据库连接（返回空 imports/exports）
 * - 当 `MYSQL_BOOT_UP === 'true'` 时，读取 env 配置并导出 `SequelizeModule` 供其他模块使用
 *
 * @export
 * @class MysqlDatabaseModule
 * @typedef {MysqlDatabaseModule}
 */
@Module({})
export class MysqlDatabaseModule {
  static forRoot(): DynamicModule {
    const envPaths = getEnvPaths();
    for (const path of envPaths) {
      dotenv.config({ path });
    }

    const isBootUp = process.env.MYSQL_BOOT_UP === 'true';
    console.log('MysqlDatabaseModule isBootUp:', isBootUp);

    if (!isBootUp) {
      return {
        module: MysqlDatabaseModule,
        imports: [],
        exports: [],
      };
    }

    return {
      module: MysqlDatabaseModule,
      imports: [
        SequelizeModule.forRootAsync({
          imports: [EnvConfigModule],
          useFactory(configService: ConfigService) {
            return {
              dialect: 'mysql',
              host: configService.get('MYSQL_HOST'),
              port: +configService.get('MYSQL_PORT')!,
              username: configService.get('MYSQL_USERNAME'),
              password: configService.get('MYSQL_PASSWORD'),
              database: configService.get('MYSQL_DATABASE'),
              models: [
                User,
                Role,
                Menu,
                Dept,
                DictType,
                DictData,
                OperLog,
                Logininfor,
                UserRole,
                RoleMenu,
                UserDept,
                File,
              ],
              synchronize: true,
              define: {
                timestamps: false,
                freezeTableName: true,
              },
              logging:
                configService.get('MYSQL_LOGGING') === 'true'
                  ? console.log
                  : false,
            };
          },
          inject: [ConfigService],
        }),
      ],
      exports: [SequelizeModule],
    };
  }
}

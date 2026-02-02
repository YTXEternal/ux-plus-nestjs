import { DynamicModule, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  SysUser,
  SysRole,
  SysMenu,
  SysDept,
  SysPost,
  SysDictType,
  SysDictData,
  SysConfig,
  SysNotice,
  SysOperLog,
  SysLogininfor,
  SysUserRole,
  SysRoleMenu,
  SysRoleDept,
  SysUserPost,
} from './model';
import { ConfigService } from '@nestjs/config';
import { EnvConfigModule } from '@/modules/env-config/env-config.module';
import { getEnvPaths } from '@/tools';
import * as dotenv from 'dotenv';

@Module({})
export class MysqlDatabaseModule {
  static forRoot(): DynamicModule {
    const envPaths = getEnvPaths();
    for (const path of envPaths) {
      dotenv.config({ path });
    }

    const isBootUp = process.env.MYSQL_BOOT_UP === 'true';

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
                SysUser,
                SysRole,
                SysMenu,
                SysDept,
                SysPost,
                SysDictType,
                SysDictData,
                SysConfig,
                SysNotice,
                SysOperLog,
                SysLogininfor,
                SysUserRole,
                SysRoleMenu,
                SysRoleDept,
                SysUserPost,
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

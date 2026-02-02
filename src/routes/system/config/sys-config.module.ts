import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysConfigService } from './sys-config.service';
import { SysConfigController } from './sys-config.controller';
import { SysConfig } from '@/databases/mysql-database/model/sys-config.model';

/**
 * 系统-参数配置模块
 *
 * 提供系统参数配置的管理接口与业务逻辑，并装配参数配置模型。
 *
 * @export
 * @class SysConfigModule
 * @typedef {SysConfigModule}
 */
@Module({
  imports: [SequelizeModule.forFeature([SysConfig])],
  controllers: [SysConfigController],
  providers: [SysConfigService],
})
export class SysConfigModule {}

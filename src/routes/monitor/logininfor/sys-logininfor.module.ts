import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysLogininforService } from './sys-logininfor.service';
import { SysLogininforController } from './sys-logininfor.controller';
import { Logininfor } from '@/databases/mysql-database/model/logininfor.model';

/**
 * 监控-登录日志模块
 *
 * 提供登录日志的查询与维护接口，并装配登录日志模型。
 *
 * @export
 * @class SysLogininforModule
 * @typedef {SysLogininforModule}
 */
@Module({
  imports: [SequelizeModule.forFeature([Logininfor])],
  controllers: [SysLogininforController],
  providers: [SysLogininforService],
})
export class SysLogininforModule {}

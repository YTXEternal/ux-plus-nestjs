import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysOperLogService } from './sys-oper-log.service';
import { SysOperLogController } from './sys-oper-log.controller';
import { OperLog } from '@/databases/mysql-database/model/oper-log.model';

/**
 * 监控-操作日志模块
 *
 * 提供操作日志的查询与维护接口，并装配操作日志模型。
 *
 * @export
 * @class SysOperLogModule
 * @typedef {SysOperLogModule}
 */
@Module({
  imports: [SequelizeModule.forFeature([OperLog])],
  controllers: [SysOperLogController],
  providers: [SysOperLogService],
})
export class SysOperLogModule {}

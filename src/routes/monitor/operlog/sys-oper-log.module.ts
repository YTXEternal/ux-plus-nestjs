import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysOperLogService } from './sys-oper-log.service';
import { SysOperLogController } from './sys-oper-log.controller';
import { SysOperLog } from '@/databases/mysql-database/model/sys-oper-log.model';

@Module({
  imports: [SequelizeModule.forFeature([SysOperLog])],
  controllers: [SysOperLogController],
  providers: [SysOperLogService],
})
export class SysOperLogModule {}

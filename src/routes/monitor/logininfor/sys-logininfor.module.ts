import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysLogininforService } from './sys-logininfor.service';
import { SysLogininforController } from './sys-logininfor.controller';
import { SysLogininfor } from '@/databases/mysql-database/model/sys-logininfor.model';

@Module({
  imports: [SequelizeModule.forFeature([SysLogininfor])],
  controllers: [SysLogininforController],
  providers: [SysLogininforService],
})
export class SysLogininforModule {}

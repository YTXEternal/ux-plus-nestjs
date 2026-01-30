import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysNoticeService } from './sys-notice.service';
import { SysNoticeController } from './sys-notice.controller';
import { SysNotice } from '@/databases/mysql-database/model/sys-notice.model';

@Module({
  imports: [SequelizeModule.forFeature([SysNotice])],
  controllers: [SysNoticeController],
  providers: [SysNoticeService],
})
export class SysNoticeModule {}

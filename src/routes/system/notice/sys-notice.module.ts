import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysNoticeService } from './sys-notice.service';
import { SysNoticeController } from './sys-notice.controller';
import { SysNotice } from '@/databases/mysql-database/model/sys-notice.model';

/**
 * 系统-通知公告模块
 *
 * 提供通知公告管理相关接口与业务逻辑，并装配通知公告模型。
 *
 * @export
 * @class SysNoticeModule
 * @typedef {SysNoticeModule}
 */
@Module({
  imports: [SequelizeModule.forFeature([SysNotice])],
  controllers: [SysNoticeController],
  providers: [SysNoticeService],
})
export class SysNoticeModule {}

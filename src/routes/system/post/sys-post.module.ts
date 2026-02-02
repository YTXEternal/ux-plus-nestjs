import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysPostService } from './sys-post.service';
import { SysPostController } from './sys-post.controller';
import { SysPost } from '@/databases/mysql-database/model/sys-post.model';

/**
 * 系统-岗位模块
 *
 * 提供岗位管理相关接口与业务逻辑，并装配岗位模型。
 *
 * @export
 * @class SysPostModule
 * @typedef {SysPostModule}
 */
@Module({
  imports: [SequelizeModule.forFeature([SysPost])],
  controllers: [SysPostController],
  providers: [SysPostService],
})
export class SysPostModule {}

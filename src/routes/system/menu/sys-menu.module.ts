import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysMenuService } from './sys-menu.service';
import { SysMenuController } from './sys-menu.controller';
import { SysMenu } from '@/databases/mysql-database/model/sys-menu.model';
import { SysRoleMenu } from '@/databases/mysql-database/model/sys-role-menu.model';

/**
 * 系统-菜单模块
 *
 * 提供菜单管理相关接口与业务逻辑，并装配菜单与角色-菜单关联模型。
 *
 * @export
 * @class SysMenuModule
 * @typedef {SysMenuModule}
 */
@Module({
  imports: [SequelizeModule.forFeature([SysMenu, SysRoleMenu])],
  controllers: [SysMenuController],
  providers: [SysMenuService],
  exports: [SysMenuService],
})
export class SysMenuModule {}

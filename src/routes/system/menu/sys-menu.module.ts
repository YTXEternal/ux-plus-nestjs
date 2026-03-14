import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysMenuService } from './sys-menu.service';
import { SysMenuController } from './sys-menu.controller';
import { Menu } from '@/databases/mysql-database/model/menu.model';
import { RoleMenu } from '@/databases/mysql-database/model/role-menu.model';

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
  imports: [SequelizeModule.forFeature([Menu, RoleMenu])],
  controllers: [SysMenuController],
  providers: [SysMenuService],
  exports: [SysMenuService],
})
export class SysMenuModule {}

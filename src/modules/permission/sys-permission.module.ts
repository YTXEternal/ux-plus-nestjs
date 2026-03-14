import { Module, Global } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysPermissionService } from './sys-permission.service';
import { Role } from '@/databases/mysql-database/model/role.model';
import { Menu } from '@/databases/mysql-database/model/menu.model';
import { User } from '@/databases/mysql-database/model/user.model';

@Global()
/**
 * 系统-权限模块
 *
 * 以全局模块方式提供权限相关能力（`SysPermissionService`），用于根据用户/角色/菜单等数据进行权限判断与查询。
 *
 * @export
 * @class SysPermissionModule
 * @typedef {SysPermissionModule}
 */
@Module({
  imports: [SequelizeModule.forFeature([Role, Menu, User])],
  providers: [SysPermissionService],
  exports: [SysPermissionService],
})
export class SysPermissionModule {}

import { Module, Global } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysPermissionService } from './sys-permission.service';
import { SysRole } from '@/databases/mysql-database/model/sys-role.model';
import { SysMenu } from '@/databases/mysql-database/model/sys-menu.model';
import { SysUser } from '@/databases/mysql-database/model/sys-user.model';

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
  imports: [SequelizeModule.forFeature([SysRole, SysMenu, SysUser])],
  providers: [SysPermissionService],
  exports: [SysPermissionService],
})
export class SysPermissionModule {}

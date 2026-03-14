import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysRoleService } from './sys-role.service';
import { SysRoleController } from './sys-role.controller';
import { Role } from '@/databases/mysql-database/model/role.model';
import { RoleMenu } from '@/databases/mysql-database/model/role-menu.model';

/**
 * 系统-角色模块
 *
 * 提供角色管理相关接口与业务逻辑，并装配角色与角色-菜单、角色-部门关联模型。
 *
 * @export
 * @class SysRoleModule
 * @typedef {SysRoleModule}
 */
@Module({
  imports: [SequelizeModule.forFeature([Role, RoleMenu])],
  controllers: [SysRoleController],
  providers: [SysRoleService],
})
export class SysRoleModule {}

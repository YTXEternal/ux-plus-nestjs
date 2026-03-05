import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysUserService } from './sys-user.service';
import { SysUserController } from './sys-user.controller';
import { SysUser } from '@/databases/mysql-database/model/sys-user.model';
import { SysRole } from '@/databases/mysql-database/model/sys-role.model';
import { SysDept } from '@/databases/mysql-database/model/sys-dept.model';
import { SysUserDept } from '@/databases/mysql-database/model/sys-user-dept.model';
import { SysUserRole } from '@/databases/mysql-database/model/sys-user-role.model';
import { UxPasswordModule } from '@/modules/ux-password/ux-password.module';

/**
 * 系统-用户模块
 *
 * 提供用户管理相关接口与业务逻辑，并装配用户/角色/岗位/部门等关联模型与密码能力依赖。
 *
 * @export
 * @class SysUserModule
 * @typedef {SysUserModule}
 */
@Module({
  imports: [
    SequelizeModule.forFeature([
      SysUser,
      SysRole,
      SysDept,
      SysUserDept,
      SysUserRole,
    ]),
    UxPasswordModule,
  ],
  controllers: [SysUserController],
  providers: [SysUserService],
  exports: [SysUserService],
})
export class SysUserModule {}

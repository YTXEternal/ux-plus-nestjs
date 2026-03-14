import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysUserService } from './sys-user.service';
import { SysUserController } from './sys-user.controller';
import { User } from '@/databases/mysql-database/model/user.model';
import { Role } from '@/databases/mysql-database/model/role.model';
import { Dept } from '@/databases/mysql-database/model/dept.model';
import { UserDept } from '@/databases/mysql-database/model/user-dept.model';
import { UserRole } from '@/databases/mysql-database/model/user-role.model';
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
    SequelizeModule.forFeature([User, Role, Dept, UserDept, UserRole]),
    UxPasswordModule,
  ],
  controllers: [SysUserController],
  providers: [SysUserService],
  exports: [SysUserService],
})
export class SysUserModule {}

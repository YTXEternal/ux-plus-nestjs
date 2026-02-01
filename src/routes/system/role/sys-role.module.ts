import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysRoleService } from './sys-role.service';
import { SysRoleController } from './sys-role.controller';
import { SysRole } from '@/databases/mysql-database/model/sys-role.model';
import { SysRoleMenu } from '@/databases/mysql-database/model/sys-role-menu.model';
import { SysRoleDept } from '@/databases/mysql-database/model/sys-role-dept.model';

@Module({
  imports: [SequelizeModule.forFeature([SysRole, SysRoleMenu, SysRoleDept])],
  controllers: [SysRoleController],
  providers: [SysRoleService],
})
export class SysRoleModule {}

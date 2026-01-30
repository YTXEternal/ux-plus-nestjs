import { Module, Global } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysPermissionService } from './sys-permission.service';
import { SysRole } from '@/databases/mysql-database/model/sys-role.model';
import { SysMenu } from '@/databases/mysql-database/model/sys-menu.model';
import { SysUser } from '@/databases/mysql-database/model/sys-user.model';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([SysRole, SysMenu, SysUser])],
  providers: [SysPermissionService],
  exports: [SysPermissionService],
})
export class SysPermissionModule {}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysUserService } from './sys-user.service';
import { SysUserController } from './sys-user.controller';
import { SysUser } from '@/databases/mysql-database/model/sys-user.model';
import { SysRole } from '@/databases/mysql-database/model/sys-role.model';
import { SysPost } from '@/databases/mysql-database/model/sys-post.model';
import { SysDept } from '@/databases/mysql-database/model/sys-dept.model';
import { UxPasswordModule } from '@/modules/ux-password/ux-password.module';

@Module({
  imports: [
    SequelizeModule.forFeature([SysUser, SysRole, SysPost, SysDept]),
    UxPasswordModule,
  ],
  controllers: [SysUserController],
  providers: [SysUserService],
  exports: [SysUserService],
})
export class SysUserModule {}

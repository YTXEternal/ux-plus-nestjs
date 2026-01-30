import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysMenuService } from './sys-menu.service';
import { SysMenuController } from './sys-menu.controller';
import { SysMenu } from '@/databases/mysql-database/model/sys-menu.model';

@Module({
  imports: [SequelizeModule.forFeature([SysMenu])],
  controllers: [SysMenuController],
  providers: [SysMenuService],
})
export class SysMenuModule {}

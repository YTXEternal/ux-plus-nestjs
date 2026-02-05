import { Module } from '@nestjs/common';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';
import { SysUserModule } from '@/routes/system/user/sys-user.module';
import { SysMenuModule } from '@/routes/system/menu/sys-menu.module';

@Module({
  imports: [SysUserModule, SysMenuModule],
  controllers: [RouteController],
  providers: [RouteService],
})
export class RouteModule {}

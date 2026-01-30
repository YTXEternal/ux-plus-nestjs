import { Controller, Get, Delete, Query, Param } from '@nestjs/common';
import { SysOnlineService } from './sys-online.service';
import { RequirePermissions } from '@/guards';

@Controller({
  path: 'monitor/online',
  version: '1',
})
export class SysOnlineController {
  constructor(private readonly sysOnlineService: SysOnlineService) {}

  @RequirePermissions('monitor:online:list')
  @Get('list')
  findAll(@Query() query: any) {
    return this.sysOnlineService.findAll(query);
  }

  @RequirePermissions('monitor:online:forceLogout')
  @Delete(':tokenId')
  forceLogout(@Param('tokenId') tokenId: string) {
    return this.sysOnlineService.forceLogout(tokenId);
  }
}

import { Controller, Get, Post, Delete, Query, Param } from '@nestjs/common';
import { SysLogininforService } from './sys-logininfor.service';
import { RequirePermissions } from '@/guards';

@Controller({
  path: 'monitor/logininfor',
  version: '1',
})
export class SysLogininforController {
  constructor(private readonly sysLogininforService: SysLogininforService) {}

  @RequirePermissions('monitor:logininfor:list')
  @Get('list')
  findAll(@Query() query: any) {
    return this.sysLogininforService.findAll(query);
  }

  @RequirePermissions('monitor:logininfor:remove')
  @Delete(':infoIds')
  remove(@Param('infoIds') infoIds: string) {
    return this.sysLogininforService.delete(infoIds);
  }

  @RequirePermissions('monitor:logininfor:remove')
  @Delete('clean')
  clean() {
    return this.sysLogininforService.clean();
  }

  @RequirePermissions('monitor:logininfor:unlock')
  @Get('unlock/:userName')
  unlock(@Param('userName') userName: string) {
    return this.sysLogininforService.unlock(userName);
  }
}

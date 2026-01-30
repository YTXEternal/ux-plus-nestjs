import { Controller, Get, Post, Delete, Query, Param } from '@nestjs/common';
import { SysOperLogService } from './sys-oper-log.service';
import { RequirePermissions } from '@/guards';

@Controller({
  path: 'monitor/operlog',
  version: '1',
})
export class SysOperLogController {
  constructor(private readonly sysOperLogService: SysOperLogService) {}

  @RequirePermissions('monitor:operlog:list')
  @Get('list')
  findAll(@Query() query: any) {
    return this.sysOperLogService.findAll(query);
  }

  @RequirePermissions('monitor:operlog:remove')
  @Delete(':operIds')
  remove(@Param('operIds') operIds: string) {
    return this.sysOperLogService.delete(operIds);
  }

  @RequirePermissions('monitor:operlog:remove')
  @Delete('clean')
  clean() {
    return this.sysOperLogService.clean();
  }
}

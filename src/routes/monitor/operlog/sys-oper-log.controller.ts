import { Controller, Get, Post, Delete, Query, Param } from '@nestjs/common';
import { SysOperLogService } from './sys-oper-log.service';

@Controller('monitor/operlog')
export class SysOperLogController {
  constructor(private readonly sysOperLogService: SysOperLogService) {}

  @Get('list')
  findAll(@Query() query: any) {
    return this.sysOperLogService.findAll(query);
  }

  @Delete(':operIds')
  remove(@Param('operIds') operIds: string) {
    return this.sysOperLogService.delete(operIds);
  }

  @Delete('clean')
  clean() {
    return this.sysOperLogService.clean();
  }
}

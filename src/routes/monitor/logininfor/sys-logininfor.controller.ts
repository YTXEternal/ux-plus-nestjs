import { Controller, Get, Post, Delete, Query, Param } from '@nestjs/common';
import { SysLogininforService } from './sys-logininfor.service';

@Controller('monitor/logininfor')
export class SysLogininforController {
  constructor(private readonly sysLogininforService: SysLogininforService) {}

  @Get('list')
  findAll(@Query() query: any) {
    return this.sysLogininforService.findAll(query);
  }

  @Delete(':infoIds')
  remove(@Param('infoIds') infoIds: string) {
    return this.sysLogininforService.delete(infoIds);
  }

  @Delete('clean')
  clean() {
    return this.sysLogininforService.clean();
  }

  @Get('unlock/:userName')
  unlock(@Param('userName') userName: string) {
    return this.sysLogininforService.unlock(userName);
  }
}

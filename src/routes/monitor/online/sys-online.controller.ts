import { Controller, Get, Delete, Query, Param } from '@nestjs/common';
import { SysOnlineService } from './sys-online.service';

@Controller('monitor/online')
export class SysOnlineController {
  constructor(private readonly sysOnlineService: SysOnlineService) {}

  @Get('list')
  findAll(@Query() query: any) {
    return this.sysOnlineService.findAll(query);
  }

  @Delete(':tokenId')
  forceLogout(@Param('tokenId') tokenId: string) {
    return this.sysOnlineService.forceLogout(tokenId);
  }
}

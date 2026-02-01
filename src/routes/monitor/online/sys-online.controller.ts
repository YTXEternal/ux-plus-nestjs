import {
  Controller,
  Get,
  Delete,
  Query,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { SysOnlineService } from './sys-online.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';
import { ListOnlineDto } from './dto/sys-online.dto';

@Controller({
  path: 'monitor/online',
  version: '1',
})
export class SysOnlineController {
  constructor(private readonly sysOnlineService: SysOnlineService) {}

  @RequirePermissions('monitor:online:list')
  @Get('list')
  async findAll(@Query() query: ListOnlineDto) {
    const data = await this.sysOnlineService.findAll(query);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('monitor:online:forceLogout')
  @Delete(':tokenId')
  async forceLogout(@Param('tokenId') tokenId: string) {
    const data = await this.sysOnlineService.forceLogout(tokenId);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

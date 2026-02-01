import {
  Controller,
  Get,
  Delete,
  Query,
  Param,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { SysOnlineService } from './sys-online.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';
import { formatPagination } from '@/tools';
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
    const { rows, total } = await this.sysOnlineService.findAll(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('monitor:online:forceLogout')
  @Delete()
  async forceLogout(@Body() body: { token_id: string }) {
    const data = await this.sysOnlineService.forceLogout(body.token_id);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

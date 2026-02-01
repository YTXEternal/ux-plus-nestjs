import {
  Controller,
  Get,
  Delete,
  Query,
  Param,
  Body,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as ApiSwaggerResponse,
} from '@nestjs/swagger';
import { SysOnlineService } from './sys-online.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';
import { formatPagination } from '@/tools';
import { ListOnlineDto, ForceLogoutDto } from './dto/sys-online.dto';

@ApiTags('系统监控-在线用户')
@Controller({
  path: 'monitor/online',
  version: '1',
})
export class SysOnlineController {
  constructor(private readonly sysOnlineService: SysOnlineService) {}

  @ApiOperation({ summary: '获取在线用户列表' })
  @ApiSwaggerResponse({ status: 200, description: '获取成功' })
  @RequirePermissions('monitor:online:list')
  @Get('list')
  async findAll(@Query() query: ListOnlineDto) {
    const { rows, total } = await this.sysOnlineService.findAll(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '强退用户' })
  @ApiSwaggerResponse({ status: 200, description: '强退成功' })
  @RequirePermissions('monitor:online:forceLogout')
  @Delete()
  async forceLogout(@Body() body: ForceLogoutDto) {
    const data = await this.sysOnlineService.forceLogout(body.token_id);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

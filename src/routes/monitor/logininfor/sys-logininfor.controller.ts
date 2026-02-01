import {
  Controller,
  Get,
  Post,
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
import { SysLogininforService } from './sys-logininfor.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';
import { formatPagination } from '@/tools';
import {
  ListLogininforDto,
  DeleteLogininforDto,
} from './dto/sys-logininfor.dto';

@ApiTags('系统监控-登录日志')
@Controller({
  path: 'monitor/logininfor',
  version: '1',
})
export class SysLogininforController {
  constructor(private readonly sysLogininforService: SysLogininforService) {}

  @ApiOperation({ summary: '获取登录日志列表' })
  @ApiSwaggerResponse({ status: 200, description: '获取成功' })
  @RequirePermissions('monitor:logininfor:list')
  @Get('list')
  async findAll(@Query() query: ListLogininforDto) {
    const { rows, total } = await this.sysLogininforService.findAll(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '删除登录日志' })
  @ApiSwaggerResponse({ status: 200, description: '删除成功' })
  @RequirePermissions('monitor:logininfor:remove')
  @Delete()
  async remove(@Body() body: DeleteLogininforDto) {
    const data = await this.sysLogininforService.delete(
      body.info_ids.join(','),
    );
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '清空登录日志' })
  @ApiSwaggerResponse({ status: 200, description: '清空成功' })
  @RequirePermissions('monitor:logininfor:remove')
  @Delete('clean')
  async clean() {
    const data = await this.sysLogininforService.clean();
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '解锁用户' })
  @ApiSwaggerResponse({ status: 200, description: '解锁成功' })
  @RequirePermissions('monitor:logininfor:unlock')
  @Get('unlock/:user_name')
  async unlock(@Param('user_name') user_name: string) {
    const data = await this.sysLogininforService.unlock(user_name);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

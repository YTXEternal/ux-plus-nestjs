import {
  Controller,
  Get,
  Delete,
  Query,
  Body,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as ApiSwaggerResponse,
} from '@nestjs/swagger';
import { SysOperLogService } from './sys-oper-log.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';
import { formatPagination } from '@/tools';
import { ListOperLogDto, DeleteOperLogDto } from './dto/sys-oper-log.dto';

@ApiTags('系统监控-操作日志')
@Controller({
  path: 'monitor/operlog',
  version: '1',
})
export class SysOperLogController {
  constructor(private readonly sysOperLogService: SysOperLogService) {}

  @ApiOperation({ summary: '获取操作日志列表' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @RequirePermissions('monitor:operlog:list')
  @Get('list')
  async findAll(@Query() query: ListOperLogDto) {
    const { rows, total } = await this.sysOperLogService.findAll(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '删除操作日志' })
  @ApiSwaggerResponse({
    status: 200,
    description: '删除成功',
    type: ApiResponse,
  })
  @RequirePermissions('monitor:operlog:remove')
  @Delete()
  async remove(@Body() body: DeleteOperLogDto) {
    const data = await this.sysOperLogService.delete(body.oper_ids.join(','));
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '清空操作日志' })
  @ApiSwaggerResponse({
    status: 200,
    description: '清空成功',
    type: ApiResponse,
  })
  @RequirePermissions('monitor:operlog:remove')
  @Delete('clean')
  async clean() {
    const data = await this.sysOperLogService.clean();
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

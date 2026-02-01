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
import { SysOperLogService } from './sys-oper-log.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';
import { formatPagination } from '@/tools';
import { ListOperLogDto } from './dto/sys-oper-log.dto';

@Controller({
  path: 'monitor/operlog',
  version: '1',
})
export class SysOperLogController {
  constructor(private readonly sysOperLogService: SysOperLogService) {}

  @RequirePermissions('monitor:operlog:list')
  @Get('list')
  async findAll(@Query() query: ListOperLogDto) {
    const { rows, total } = await this.sysOperLogService.findAll(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('monitor:operlog:remove')
  @Delete()
  async remove(@Body() body: { oper_ids: number[] }) {
    const data = await this.sysOperLogService.delete(body.oper_ids.join(','));
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('monitor:operlog:remove')
  @Delete('clean')
  async clean() {
    const data = await this.sysOperLogService.clean();
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

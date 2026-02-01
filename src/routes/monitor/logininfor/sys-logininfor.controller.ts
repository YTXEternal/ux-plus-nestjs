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
import { SysLogininforService } from './sys-logininfor.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';
import { formatPagination } from '@/tools';
import { ListLogininforDto } from './dto/sys-logininfor.dto';

@Controller({
  path: 'monitor/logininfor',
  version: '1',
})
export class SysLogininforController {
  constructor(private readonly sysLogininforService: SysLogininforService) {}

  @RequirePermissions('monitor:logininfor:list')
  @Get('list')
  async findAll(@Query() query: ListLogininforDto) {
    const { rows, total } = await this.sysLogininforService.findAll(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('monitor:logininfor:remove')
  @Delete()
  async remove(@Body() body: { info_ids: number[] }) {
    const data = await this.sysLogininforService.delete(
      body.info_ids.join(','),
    );
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('monitor:logininfor:remove')
  @Delete('clean')
  async clean() {
    const data = await this.sysLogininforService.clean();
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('monitor:logininfor:unlock')
  @Get('unlock/:user_name')
  async unlock(@Param('user_name') user_name: string) {
    const data = await this.sysLogininforService.unlock(user_name);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { SysOperLogService } from './sys-oper-log.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';
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
    const data = await this.sysOperLogService.findAll(query);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('monitor:operlog:remove')
  @Delete(':operIds')
  async remove(@Param('operIds') operIds: string) {
    const data = await this.sysOperLogService.delete(operIds);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('monitor:operlog:remove')
  @Delete('clean')
  async clean() {
    const data = await this.sysOperLogService.clean();
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

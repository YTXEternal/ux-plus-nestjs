import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { SysLogininforService } from './sys-logininfor.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';
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
    const data = await this.sysLogininforService.findAll(query);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('monitor:logininfor:remove')
  @Delete(':infoIds')
  async remove(@Param('infoIds') infoIds: string) {
    const data = await this.sysLogininforService.delete(infoIds);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('monitor:logininfor:remove')
  @Delete('clean')
  async clean() {
    const data = await this.sysLogininforService.clean();
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('monitor:logininfor:unlock')
  @Get('unlock/:userName')
  async unlock(@Param('userName') userName: string) {
    const data = await this.sysLogininforService.unlock(userName);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

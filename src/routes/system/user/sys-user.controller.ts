import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
} from '@nestjs/common';
import { SysUserService } from './sys-user.service';
import { RequirePermissions } from '@/guards';

@Controller({
  path: 'system/user',
  version: '1',
})
export class SysUserController {
  constructor(private readonly sysUserService: SysUserService) {}

  @RequirePermissions('system:user:list')
  @Get('list')
  findAll(@Query() query: any) {
    return this.sysUserService.findAll(query);
  }

  @RequirePermissions('system:user:query')
  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.sysUserService.findOne(+userId);
  }

  @RequirePermissions('system:user:add')
  @Post()
  create(@Body() body: any) {
    return this.sysUserService.create(body);
  }

  @RequirePermissions('system:user:edit')
  @Put()
  update(@Body() body: any) {
    return this.sysUserService.update(body);
  }

  @RequirePermissions('system:user:remove')
  @Delete(':userIds')
  remove(@Param('userIds') userIds: string) {
    return this.sysUserService.delete(userIds);
  }

  @RequirePermissions('system:user:resetPwd')
  @Put('resetPwd')
  resetPwd(@Body() body: any) {
    return this.sysUserService.resetPwd(body);
  }

  @RequirePermissions('system:user:edit')
  @Put('changeStatus')
  changeStatus(@Body() body: any) {
    return this.sysUserService.changeStatus(body);
  }
}

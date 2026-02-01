import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { SysUserService } from './sys-user.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';

import {
  ListUserDto,
  CreateUserDto,
  UpdateUserDto,
  ResetPwdDto,
  ChangeStatusDto,
} from './dto/sys-user.dto';

@Controller({
  path: 'system/user',
  version: '1',
})
export class SysUserController {
  constructor(private readonly sysUserService: SysUserService) {}

  @RequirePermissions('system:user:list')
  @Get('list')
  async findAll(@Query() query: ListUserDto) {
    const data = await this.sysUserService.findAll(query);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:user:query')
  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    const data = await this.sysUserService.findOne(+userId);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:user:add')
  @Post()
  async create(@Body() body: CreateUserDto) {
    const data = await this.sysUserService.create(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:user:edit')
  @Put()
  async update(@Body() body: UpdateUserDto) {
    const data = await this.sysUserService.update(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:user:remove')
  @Delete(':userIds')
  async remove(@Param('userIds') userIds: string) {
    const data = await this.sysUserService.delete(userIds);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:user:resetPwd')
  @Put('resetPwd')
  async resetPwd(@Body() body: ResetPwdDto) {
    const data = await this.sysUserService.resetPwd(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:user:edit')
  @Put('changeStatus')
  async changeStatus(@Body() body: ChangeStatusDto) {
    const data = await this.sysUserService.changeStatus(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

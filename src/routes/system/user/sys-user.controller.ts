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
import { formatPagination } from '@/tools';

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
    const { rows, total } = await this.sysUserService.findAll(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:user:query')
  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    const { data } = await this.sysUserService.findOne(+userId);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:user:add')
  @Post()
  async create(@Body() body: CreateUserDto) {
    console.log('body', body);
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
  @Delete()
  async remove(@Body() body: { user_ids: number[] }) {
    const [result] = await this.sysUserService.delete(body.user_ids.join(','));
    const message = result === body.user_ids.length ? '删除成功' : '删除失败';
    return new ApiResponse(HttpStatus.OK, message, null);
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

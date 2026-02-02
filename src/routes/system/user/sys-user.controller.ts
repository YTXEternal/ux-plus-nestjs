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
import {
  ApiTags,
  ApiOperation,
  ApiResponse as ApiSwaggerResponse,
  ApiParam,
} from '@nestjs/swagger';
import { SysUserService } from './sys-user.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';
import { formatPagination } from '@/tools';

import {
  ListUserDto,
  GetUserParamDto,
  CreateUserDto,
  UpdateUserDto,
  ResetPwdDto,
  ChangeStatusDto,
  DeleteUserDto,
} from './dto/sys-user.dto';

@ApiTags('系统管理-用户管理')
@Controller({
  path: 'system/user',
  version: '1',
})
export class SysUserController {
  constructor(private readonly sysUserService: SysUserService) {}

  @ApiOperation({ summary: '获取用户列表' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:user:list')
  @Get('list')
  async findAll(@Query() query: ListUserDto) {
    const { rows, total } = await this.sysUserService.findAll(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '获取用户详情' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @ApiParam({ name: 'userId', description: '用户ID', example: 1 })
  @RequirePermissions('system:user:query')
  @Get(':userId')
  async findOne(@Param() params: GetUserParamDto) {
    const { data } = await this.sysUserService.findOne(params.userId);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '新增用户' })
  @ApiSwaggerResponse({
    status: 200,
    description: '新增成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:user:add')
  @Post()
  async create(@Body() body: CreateUserDto) {
    console.log('body', body);
    const data = await this.sysUserService.create(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '修改用户' })
  @ApiSwaggerResponse({
    status: 200,
    description: '修改成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:user:edit')
  @Put()
  async update(@Body() body: UpdateUserDto) {
    const data = await this.sysUserService.update(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '删除用户' })
  @ApiSwaggerResponse({
    status: 200,
    description: '删除成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:user:remove')
  @Delete()
  async remove(@Body() body: DeleteUserDto) {
    const [result] = await this.sysUserService.delete(body.user_ids.join(','));
    const message = result === body.user_ids.length ? '删除成功' : '删除失败';
    return new ApiResponse(HttpStatus.OK, message, null);
  }

  @ApiOperation({ summary: '重置密码' })
  @ApiSwaggerResponse({
    status: 200,
    description: '重置成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:user:resetPwd')
  @Put('resetPwd')
  async resetPwd(@Body() body: ResetPwdDto) {
    const data = await this.sysUserService.resetPwd(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '修改状态' })
  @ApiSwaggerResponse({
    status: 200,
    description: '修改成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:user:edit')
  @Put('changeStatus')
  async changeStatus(@Body() body: ChangeStatusDto) {
    const data = await this.sysUserService.changeStatus(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

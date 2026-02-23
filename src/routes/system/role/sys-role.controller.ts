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
import { SysRoleService } from './sys-role.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';
import { formatPagination } from '@/tools';

import {
  ListRoleDto,
  GetRoleParamDto,
  CreateRoleDto,
  UpdateRoleDto,
  ChangeRoleStatusDto,
  DeleteRoleDto,
} from './dto/sys-role.dto';

@ApiTags('系统管理-角色管理')
@Controller({
  path: 'system/role',
  version: '1',
})
export class SysRoleController {
  constructor(private readonly sysRoleService: SysRoleService) {}

  @ApiOperation({ summary: '获取角色列表' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:role:list')
  @Get('list')
  async findAll(@Query() query: ListRoleDto) {
    const { rows, total } = await this.sysRoleService.findAll(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '获取角色详情' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @ApiParam({ name: 'roleId', description: '角色ID', example: 1 })
  @RequirePermissions('system:role:query')
  @Get(':roleId')
  async findOne(@Param() params: GetRoleParamDto) {
    const data = await this.sysRoleService.findOne(params.roleId);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '新增角色' })
  @ApiSwaggerResponse({
    status: 200,
    description: '新增成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:role:add')
  @Post()
  async create(@Body() body: CreateRoleDto) {
    const data = await this.sysRoleService.create(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '修改角色' })
  @ApiSwaggerResponse({
    status: 200,
    description: '修改成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:role:edit')
  @Put()
  async update(@Body() body: UpdateRoleDto) {
    console.log('进入修改角色');
    const data = await this.sysRoleService.update(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '删除角色' })
  @ApiSwaggerResponse({
    status: 200,
    description: '删除成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:role:remove')
  @Delete()
  async remove(@Body() body: DeleteRoleDto) {
    const data = await this.sysRoleService.delete(body.role_ids.join(','));
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '修改角色状态' })
  @ApiSwaggerResponse({
    status: 200,
    description: '修改成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:role:edit')
  @Put('changeStatus')
  async changeStatus(@Body() body: ChangeRoleStatusDto) {
    const data = await this.sysRoleService.changeStatus(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

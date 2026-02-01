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
import { SysRoleService } from './sys-role.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';
import { formatPagination } from '@/tools';

import {
  ListRoleDto,
  CreateRoleDto,
  UpdateRoleDto,
  ChangeRoleStatusDto,
} from './dto/sys-role.dto';

@Controller({
  path: 'system/role',
  version: '1',
})
export class SysRoleController {
  constructor(private readonly sysRoleService: SysRoleService) {}

  @RequirePermissions('system:role:list')
  @Get('list')
  async findAll(@Query() query: ListRoleDto) {
    const { rows, total } = await this.sysRoleService.findAll(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:role:query')
  @Get(':roleId')
  async findOne(@Param('roleId') roleId: string) {
    const data = await this.sysRoleService.findOne(+roleId);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:role:add')
  @Post()
  async create(@Body() body: CreateRoleDto) {
    const data = await this.sysRoleService.create(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:role:edit')
  @Put()
  async update(@Body() body: UpdateRoleDto) {
    const data = await this.sysRoleService.update(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:role:remove')
  @Delete()
  async remove(@Body() body: { role_ids: number[] }) {
    const data = await this.sysRoleService.delete(body.role_ids.join(','));
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:role:edit')
  @Put('changeStatus')
  async changeStatus(@Body() body: ChangeRoleStatusDto) {
    const data = await this.sysRoleService.changeStatus(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

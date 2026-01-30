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
import { SysRoleService } from './sys-role.service';
import { RequirePermissions } from '@/guards';

@Controller({
  path: 'system/role',
  version: '1',
})
export class SysRoleController {
  constructor(private readonly sysRoleService: SysRoleService) {}

  @RequirePermissions('system:role:list')
  @Get('list')
  findAll(@Query() query: any) {
    return this.sysRoleService.findAll(query);
  }

  @RequirePermissions('system:role:query')
  @Get(':roleId')
  findOne(@Param('roleId') roleId: string) {
    return this.sysRoleService.findOne(+roleId);
  }

  @RequirePermissions('system:role:add')
  @Post()
  create(@Body() body: any) {
    return this.sysRoleService.create(body);
  }

  @RequirePermissions('system:role:edit')
  @Put()
  update(@Body() body: any) {
    return this.sysRoleService.update(body);
  }

  @RequirePermissions('system:role:remove')
  @Delete(':roleIds')
  remove(@Param('roleIds') roleIds: string) {
    return this.sysRoleService.delete(roleIds);
  }

  @RequirePermissions('system:role:edit')
  @Put('changeStatus')
  changeStatus(@Body() body: any) {
    return this.sysRoleService.changeStatus(body);
  }
}

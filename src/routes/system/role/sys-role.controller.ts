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

@Controller('system/role')
export class SysRoleController {
  constructor(private readonly sysRoleService: SysRoleService) {}

  @Get('list')
  findAll(@Query() query: any) {
    return this.sysRoleService.findAll(query);
  }

  @Get(':roleId')
  findOne(@Param('roleId') roleId: string) {
    return this.sysRoleService.findOne(+roleId);
  }

  @Post()
  create(@Body() body: any) {
    return this.sysRoleService.create(body);
  }

  @Put()
  update(@Body() body: any) {
    return this.sysRoleService.update(body);
  }

  @Delete(':roleIds')
  remove(@Param('roleIds') roleIds: string) {
    return this.sysRoleService.delete(roleIds);
  }

  @Put('changeStatus')
  changeStatus(@Body() body: any) {
    return this.sysRoleService.changeStatus(body);
  }
}

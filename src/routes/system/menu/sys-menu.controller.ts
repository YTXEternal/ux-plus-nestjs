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
import { SysMenuService } from './sys-menu.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';

import { ListMenuDto, CreateMenuDto, UpdateMenuDto } from './dto/sys-menu.dto';

@Controller({
  path: 'system/menu',
  version: '1',
})
export class SysMenuController {
  constructor(private readonly sysMenuService: SysMenuService) {}

  @RequirePermissions('system:menu:list')
  @Get('list')
  async findAll(@Query() query: ListMenuDto) {
    const data = await this.sysMenuService.findAll(query);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:menu:query')
  @Get(':menuId')
  async findOne(@Param('menuId') menuId: string) {
    const data = await this.sysMenuService.findOne(+menuId);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:menu:add')
  @Post()
  async create(@Body() body: CreateMenuDto) {
    const data = await this.sysMenuService.create(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:menu:edit')
  @Put()
  async update(@Body() body: UpdateMenuDto) {
    const data = await this.sysMenuService.update(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:menu:remove')
  @Delete(':menuId')
  async remove(@Param('menuId') menuId: string) {
    const data = await this.sysMenuService.delete(+menuId);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:menu:list')
  @Get('treeselect')
  async treeselect() {
    const data = await this.sysMenuService.getTreeSelect();
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

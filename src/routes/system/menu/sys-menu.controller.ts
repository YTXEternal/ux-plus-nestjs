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
import { SysMenuService } from './sys-menu.service';
import { RequirePermissions } from '@/guards';

@Controller({
  path: 'system/menu',
  version: '1',
})
export class SysMenuController {
  constructor(private readonly sysMenuService: SysMenuService) {}

  @RequirePermissions('system:menu:list')
  @Get('list')
  findAll(@Query() query: any) {
    return this.sysMenuService.findAll(query);
  }

  @RequirePermissions('system:menu:query')
  @Get(':menuId')
  findOne(@Param('menuId') menuId: string) {
    return this.sysMenuService.findOne(+menuId);
  }

  @RequirePermissions('system:menu:add')
  @Post()
  create(@Body() body: any) {
    return this.sysMenuService.create(body);
  }

  @RequirePermissions('system:menu:edit')
  @Put()
  update(@Body() body: any) {
    return this.sysMenuService.update(body);
  }

  @RequirePermissions('system:menu:remove')
  @Delete(':menuId')
  remove(@Param('menuId') menuId: string) {
    return this.sysMenuService.delete(+menuId);
  }

  @RequirePermissions('system:menu:list')
  @Get('treeselect')
  treeselect() {
    return this.sysMenuService.getTreeSelect();
  }
}

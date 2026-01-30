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

@Controller('system/menu')
export class SysMenuController {
  constructor(private readonly sysMenuService: SysMenuService) {}

  @Get('list')
  findAll(@Query() query: any) {
    return this.sysMenuService.findAll(query);
  }

  @Get(':menuId')
  findOne(@Param('menuId') menuId: string) {
    return this.sysMenuService.findOne(+menuId);
  }

  @Post()
  create(@Body() body: any) {
    return this.sysMenuService.create(body);
  }

  @Put()
  update(@Body() body: any) {
    return this.sysMenuService.update(body);
  }

  @Delete(':menuId')
  remove(@Param('menuId') menuId: string) {
    return this.sysMenuService.delete(+menuId);
  }

  @Get('treeselect')
  treeselect() {
    return this.sysMenuService.getTreeSelect();
  }
}

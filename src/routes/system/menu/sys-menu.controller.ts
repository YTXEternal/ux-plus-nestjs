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
import { SysMenuService } from './sys-menu.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';

import {
  ListMenuDto,
  GetMenuParamDto,
  CreateMenuDto,
  UpdateMenuDto,
  DeleteMenuDto,
} from './dto/sys-menu.dto';

@ApiTags('系统管理-菜单管理')
@Controller({
  path: 'system/menu',
  version: '1',
})
export class SysMenuController {
  constructor(private readonly sysMenuService: SysMenuService) {}

  @ApiOperation({ summary: '获取菜单列表' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:menu:list')
  @Get('list')
  async findAll(@Query() query: ListMenuDto) {
    const data = await this.sysMenuService.findAll(query);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '获取菜单详情' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @ApiParam({ name: 'menuId', description: '菜单ID', example: 1 })
  @RequirePermissions('system:menu:query')
  @Get(':menuId')
  async findOne(@Param() params: GetMenuParamDto) {
    const data = await this.sysMenuService.findOne(params.menuId);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '新增菜单' })
  @ApiSwaggerResponse({
    status: 200,
    description: '新增成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:menu:add')
  @Post()
  async create(@Body() body: CreateMenuDto) {
    const data = await this.sysMenuService.create(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '修改菜单' })
  @ApiSwaggerResponse({
    status: 200,
    description: '修改成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:menu:edit')
  @Put()
  async update(@Body() body: UpdateMenuDto) {
    const data = await this.sysMenuService.update(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '删除菜单' })
  @ApiSwaggerResponse({
    status: 200,
    description: '删除成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:menu:remove')
  @Delete()
  async remove(@Body() body: DeleteMenuDto) {
    const data = await this.sysMenuService.delete(body.menu_id);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

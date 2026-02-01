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
} from '@nestjs/swagger';
import { SysDeptService } from './sys-dept.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';

import {
  ListDeptDto,
  CreateDeptDto,
  UpdateDeptDto,
  DeleteDeptDto,
} from './dto/sys-dept.dto';

@ApiTags('系统管理-部门管理')
@Controller({
  path: 'system/dept',
  version: '1',
})
export class SysDeptController {
  constructor(private readonly sysDeptService: SysDeptService) {}

  @ApiOperation({ summary: '获取部门列表' })
  @ApiSwaggerResponse({ status: 200, description: '获取成功' })
  @RequirePermissions('system:dept:list')
  @Get('list')
  async findAll(@Query() query: ListDeptDto) {
    const data = await this.sysDeptService.findAll(query);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '获取部门详情' })
  @ApiSwaggerResponse({ status: 200, description: '获取成功' })
  @RequirePermissions('system:dept:query')
  @Get(':deptId')
  async findOne(@Param('deptId') deptId: string) {
    const data = await this.sysDeptService.findOne(+deptId);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '新增部门' })
  @ApiSwaggerResponse({ status: 200, description: '新增成功' })
  @RequirePermissions('system:dept:add')
  @Post()
  async create(@Body() body: CreateDeptDto) {
    const data = await this.sysDeptService.create(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '修改部门' })
  @ApiSwaggerResponse({ status: 200, description: '修改成功' })
  @RequirePermissions('system:dept:edit')
  @Put()
  async update(@Body() body: UpdateDeptDto) {
    const data = await this.sysDeptService.update(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '删除部门' })
  @ApiSwaggerResponse({ status: 200, description: '删除成功' })
  @RequirePermissions('system:dept:remove')
  @Delete()
  async remove(@Body() body: DeleteDeptDto) {
    const data = await this.sysDeptService.delete(body.dept_id);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

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
import { SysDeptService } from './sys-dept.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';

import { ListDeptDto, CreateDeptDto, UpdateDeptDto } from './dto/sys-dept.dto';

@Controller({
  path: 'system/dept',
  version: '1',
})
export class SysDeptController {
  constructor(private readonly sysDeptService: SysDeptService) {}

  @RequirePermissions('system:dept:list')
  @Get('list')
  async findAll(@Query() query: ListDeptDto) {
    const data = await this.sysDeptService.findAll(query);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:dept:query')
  @Get(':deptId')
  async findOne(@Param('deptId') deptId: string) {
    const data = await this.sysDeptService.findOne(+deptId);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:dept:add')
  @Post()
  async create(@Body() body: CreateDeptDto) {
    const data = await this.sysDeptService.create(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:dept:edit')
  @Put()
  async update(@Body() body: UpdateDeptDto) {
    const data = await this.sysDeptService.update(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:dept:remove')
  @Delete()
  async remove(@Body() body: { dept_id: number }) {
    const data = await this.sysDeptService.delete(body.dept_id);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

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
import { SysDeptService } from './sys-dept.service';
import { RequirePermissions } from '@/guards';

@Controller({
  path: 'system/dept',
  version: '1',
})
export class SysDeptController {
  constructor(private readonly sysDeptService: SysDeptService) {}

  @RequirePermissions('system:dept:list')
  @Get('list')
  findAll(@Query() query: any) {
    return this.sysDeptService.findAll(query);
  }

  @RequirePermissions('system:dept:query')
  @Get(':deptId')
  findOne(@Param('deptId') deptId: string) {
    return this.sysDeptService.findOne(+deptId);
  }

  @RequirePermissions('system:dept:add')
  @Post()
  create(@Body() body: any) {
    return this.sysDeptService.create(body);
  }

  @RequirePermissions('system:dept:edit')
  @Put()
  update(@Body() body: any) {
    return this.sysDeptService.update(body);
  }

  @RequirePermissions('system:dept:remove')
  @Delete(':deptId')
  remove(@Param('deptId') deptId: string) {
    return this.sysDeptService.delete(+deptId);
  }
}

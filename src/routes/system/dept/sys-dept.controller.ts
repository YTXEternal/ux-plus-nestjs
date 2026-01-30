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

@Controller('system/dept')
export class SysDeptController {
  constructor(private readonly sysDeptService: SysDeptService) {}

  @Get('list')
  findAll(@Query() query: any) {
    return this.sysDeptService.findAll(query);
  }

  @Get(':deptId')
  findOne(@Param('deptId') deptId: string) {
    return this.sysDeptService.findOne(+deptId);
  }

  @Post()
  create(@Body() body: any) {
    return this.sysDeptService.create(body);
  }

  @Put()
  update(@Body() body: any) {
    return this.sysDeptService.update(body);
  }

  @Delete(':deptId')
  remove(@Param('deptId') deptId: string) {
    return this.sysDeptService.delete(+deptId);
  }
}

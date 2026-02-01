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
import { SysPostService } from './sys-post.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';

import { ListPostDto, CreatePostDto, UpdatePostDto } from './dto/sys-post.dto';

@Controller({
  path: 'system/post',
  version: '1',
})
export class SysPostController {
  constructor(private readonly sysPostService: SysPostService) {}

  @RequirePermissions('system:post:list')
  @Get('list')
  async findAll(@Query() query: ListPostDto) {
    const data = await this.sysPostService.findAll(query);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:post:query')
  @Get(':postId')
  async findOne(@Param('postId') postId: string) {
    const data = await this.sysPostService.findOne(+postId);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:post:add')
  @Post()
  async create(@Body() body: CreatePostDto) {
    const data = await this.sysPostService.create(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:post:edit')
  @Put()
  async update(@Body() body: UpdatePostDto) {
    const data = await this.sysPostService.update(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:post:remove')
  @Delete(':postIds')
  async remove(@Param('postIds') postIds: string) {
    const data = await this.sysPostService.delete(postIds);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

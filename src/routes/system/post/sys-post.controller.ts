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
import { SysPostService } from './sys-post.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';
import { formatPagination } from '@/tools';

import {
  ListPostDto,
  CreatePostDto,
  UpdatePostDto,
  DeletePostDto,
} from './dto/sys-post.dto';

@ApiTags('系统管理-岗位管理')
@Controller({
  path: 'system/post',
  version: '1',
})
export class SysPostController {
  constructor(private readonly sysPostService: SysPostService) {}

  @ApiOperation({ summary: '获取岗位列表' })
  @ApiSwaggerResponse({ status: 200, description: '获取成功' })
  @RequirePermissions('system:post:list')
  @Get('list')
  async findAll(@Query() query: ListPostDto) {
    const { rows, total } = await this.sysPostService.findAll(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '获取岗位详情' })
  @ApiSwaggerResponse({ status: 200, description: '获取成功' })
  @RequirePermissions('system:post:query')
  @Get(':postId')
  async findOne(@Param('postId') postId: string) {
    const data = await this.sysPostService.findOne(+postId);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '新增岗位' })
  @ApiSwaggerResponse({ status: 200, description: '新增成功' })
  @RequirePermissions('system:post:add')
  @Post()
  async create(@Body() body: CreatePostDto) {
    const data = await this.sysPostService.create(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '修改岗位' })
  @ApiSwaggerResponse({ status: 200, description: '修改成功' })
  @RequirePermissions('system:post:edit')
  @Put()
  async update(@Body() body: UpdatePostDto) {
    const data = await this.sysPostService.update(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '删除岗位' })
  @ApiSwaggerResponse({ status: 200, description: '删除成功' })
  @RequirePermissions('system:post:remove')
  @Delete()
  async remove(@Body() body: DeletePostDto) {
    const data = await this.sysPostService.delete(body.post_ids.join(','));
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

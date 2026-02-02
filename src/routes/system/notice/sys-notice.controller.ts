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
import { SysNoticeService } from './sys-notice.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';
import { formatPagination } from '@/tools';

import {
  ListNoticeDto,
  GetNoticeParamDto,
  CreateNoticeDto,
  UpdateNoticeDto,
  DeleteNoticeDto,
} from './dto/sys-notice.dto';

@ApiTags('系统管理-通知公告')
@Controller({
  path: 'system/notice',
  version: '1',
})
export class SysNoticeController {
  constructor(private readonly sysNoticeService: SysNoticeService) {}

  @ApiOperation({ summary: '获取公告列表' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:notice:list')
  @Get('list')
  async findAll(@Query() query: ListNoticeDto) {
    const { rows, total } = await this.sysNoticeService.findAll(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '获取公告详情' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @ApiParam({ name: 'noticeId', description: '公告ID', example: 1 })
  @RequirePermissions('system:notice:query')
  @Get(':noticeId')
  async findOne(@Param() params: GetNoticeParamDto) {
    const data = await this.sysNoticeService.findOne(params.noticeId);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '新增公告' })
  @ApiSwaggerResponse({
    status: 200,
    description: '新增成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:notice:add')
  @Post()
  async create(@Body() body: CreateNoticeDto) {
    const data = await this.sysNoticeService.create(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '修改公告' })
  @ApiSwaggerResponse({
    status: 200,
    description: '修改成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:notice:edit')
  @Put()
  async update(@Body() body: UpdateNoticeDto) {
    const data = await this.sysNoticeService.update(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '删除公告' })
  @ApiSwaggerResponse({
    status: 200,
    description: '删除成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:notice:remove')
  @Delete()
  async remove(@Body() body: DeleteNoticeDto) {
    const data = await this.sysNoticeService.delete(body.notice_ids.join(','));
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

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
import { SysNoticeService } from './sys-notice.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';

import {
  ListNoticeDto,
  CreateNoticeDto,
  UpdateNoticeDto,
} from './dto/sys-notice.dto';

@Controller({
  path: 'system/notice',
  version: '1',
})
export class SysNoticeController {
  constructor(private readonly sysNoticeService: SysNoticeService) {}

  @RequirePermissions('system:notice:list')
  @Get('list')
  async findAll(@Query() query: ListNoticeDto) {
    const data = await this.sysNoticeService.findAll(query);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:notice:query')
  @Get(':noticeId')
  async findOne(@Param('noticeId') noticeId: string) {
    const data = await this.sysNoticeService.findOne(+noticeId);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:notice:add')
  @Post()
  async create(@Body() body: CreateNoticeDto) {
    const data = await this.sysNoticeService.create(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:notice:edit')
  @Put()
  async update(@Body() body: UpdateNoticeDto) {
    const data = await this.sysNoticeService.update(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:notice:remove')
  @Delete(':noticeIds')
  async remove(@Param('noticeIds') noticeIds: string) {
    const data = await this.sysNoticeService.delete(noticeIds);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

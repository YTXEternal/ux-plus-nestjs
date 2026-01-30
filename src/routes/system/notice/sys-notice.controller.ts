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
import { SysNoticeService } from './sys-notice.service';

@Controller('system/notice')
export class SysNoticeController {
  constructor(private readonly sysNoticeService: SysNoticeService) {}

  @Get('list')
  findAll(@Query() query: any) {
    return this.sysNoticeService.findAll(query);
  }

  @Get(':noticeId')
  findOne(@Param('noticeId') noticeId: string) {
    return this.sysNoticeService.findOne(+noticeId);
  }

  @Post()
  create(@Body() body: any) {
    return this.sysNoticeService.create(body);
  }

  @Put()
  update(@Body() body: any) {
    return this.sysNoticeService.update(body);
  }

  @Delete(':noticeIds')
  remove(@Param('noticeIds') noticeIds: string) {
    return this.sysNoticeService.delete(noticeIds);
  }
}

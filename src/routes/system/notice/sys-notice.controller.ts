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
import { RequirePermissions } from '@/guards';

@Controller({
  path: 'system/notice',
  version: '1',
})
export class SysNoticeController {
  constructor(private readonly sysNoticeService: SysNoticeService) {}

  @RequirePermissions('system:notice:list')
  @Get('list')
  findAll(@Query() query: any) {
    return this.sysNoticeService.findAll(query);
  }

  @RequirePermissions('system:notice:query')
  @Get(':noticeId')
  findOne(@Param('noticeId') noticeId: string) {
    return this.sysNoticeService.findOne(+noticeId);
  }

  @RequirePermissions('system:notice:add')
  @Post()
  create(@Body() body: any) {
    return this.sysNoticeService.create(body);
  }

  @RequirePermissions('system:notice:edit')
  @Put()
  update(@Body() body: any) {
    return this.sysNoticeService.update(body);
  }

  @RequirePermissions('system:notice:remove')
  @Delete(':noticeIds')
  remove(@Param('noticeIds') noticeIds: string) {
    return this.sysNoticeService.delete(noticeIds);
  }
}

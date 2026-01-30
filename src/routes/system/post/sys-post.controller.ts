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
import { SysPostService } from './sys-post.service';
import { RequirePermissions } from '@/guards';

@Controller({
  path: 'system/post',
  version: '1',
})
export class SysPostController {
  constructor(private readonly sysPostService: SysPostService) {}

  @RequirePermissions('system:post:list')
  @Get('list')
  findAll(@Query() query: any) {
    return this.sysPostService.findAll(query);
  }

  @RequirePermissions('system:post:query')
  @Get(':postId')
  findOne(@Param('postId') postId: string) {
    return this.sysPostService.findOne(+postId);
  }

  @RequirePermissions('system:post:add')
  @Post()
  create(@Body() body: any) {
    return this.sysPostService.create(body);
  }

  @RequirePermissions('system:post:edit')
  @Put()
  update(@Body() body: any) {
    return this.sysPostService.update(body);
  }

  @RequirePermissions('system:post:remove')
  @Delete(':postIds')
  remove(@Param('postIds') postIds: string) {
    return this.sysPostService.delete(postIds);
  }
}

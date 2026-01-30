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

@Controller('system/post')
export class SysPostController {
  constructor(private readonly sysPostService: SysPostService) {}

  @Get('list')
  findAll(@Query() query: any) {
    return this.sysPostService.findAll(query);
  }

  @Get(':postId')
  findOne(@Param('postId') postId: string) {
    return this.sysPostService.findOne(+postId);
  }

  @Post()
  create(@Body() body: any) {
    return this.sysPostService.create(body);
  }

  @Put()
  update(@Body() body: any) {
    return this.sysPostService.update(body);
  }

  @Delete(':postIds')
  remove(@Param('postIds') postIds: string) {
    return this.sysPostService.delete(postIds);
  }
}

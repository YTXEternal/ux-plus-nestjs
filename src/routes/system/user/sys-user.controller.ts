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
import { SysUserService } from './sys-user.service';

@Controller('system/user')
export class SysUserController {
  constructor(private readonly sysUserService: SysUserService) {}

  @Get('list')
  findAll(@Query() query: any) {
    return this.sysUserService.findAll(query);
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.sysUserService.findOne(+userId);
  }

  @Post()
  create(@Body() body: any) {
    return this.sysUserService.create(body);
  }

  @Put()
  update(@Body() body: any) {
    return this.sysUserService.update(body);
  }

  @Delete(':userIds')
  remove(@Param('userIds') userIds: string) {
    return this.sysUserService.delete(userIds);
  }

  @Put('resetPwd')
  resetPwd(@Body() body: any) {
    return this.sysUserService.resetPwd(body);
  }

  @Put('changeStatus')
  changeStatus(@Body() body: any) {
    return this.sysUserService.changeStatus(body);
  }
}

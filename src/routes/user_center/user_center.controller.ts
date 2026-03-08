import {
  Controller,
  Get,
  Put,
  Body,
  Req,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as ApiSwaggerResponse,
} from '@nestjs/swagger';
import { UserCenterService } from './user_center.service';
import { ApiResponse } from '@/dto/api-response';
import { UpdateUserProfileDto } from './dto/user_center.dto';
import { Request } from 'express';

@ApiTags('个人中心')
@Controller({
  path: 'user_center',
  version: '1',
})
export class UserCenterController {
  constructor(private readonly userCenterService: UserCenterService) {}

  @ApiOperation({ summary: '获取个人信息' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @Get('detail')
  async getProfile(@Req() request: Request) {
    const userPayload = (request as any).user;
    if (!userPayload || !userPayload.user_id) {
      throw new HttpException('未授权的方法调用', HttpStatus.UNAUTHORIZED);
    }

    const data = await this.userCenterService.getProfile(userPayload.user_id);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '修改个人信息' })
  @ApiSwaggerResponse({
    status: 200,
    description: '修改成功',
    type: ApiResponse,
  })
  @Put('update')
  async updateProfile(
    @Body() body: UpdateUserProfileDto,
    @Req() request: Request,
  ) {
    const userPayload = (request as any).user;
    if (!userPayload || !userPayload.user_id) {
      throw new HttpException('未授权的方法调用', HttpStatus.UNAUTHORIZED);
    }

    await this.userCenterService.updateProfile(userPayload.user_id, body);
    return new ApiResponse(HttpStatus.OK, '操作成功', null);
  }
}

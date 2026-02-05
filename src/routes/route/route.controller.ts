import {
  Controller,
  Get,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as ApiSwaggerResponse,
} from '@nestjs/swagger';
import { RouteService } from './route.service';
import { Request } from 'express';
import { ApiResponse } from '@/dto/api-response';
import { RouterResult } from '@/routes/auth/dto/auth.dto';

@ApiTags('路由管理')
@Controller({
  path: 'route',
  version: '1',
})
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @ApiOperation({ summary: '获取路由信息' })
  @ApiSwaggerResponse({ type: RouterResult })
  @Get('/routers')
  async routers(@Req() request: Request) {
    const userPayload = (request as any).user;
    if (!userPayload) {
      throw new HttpException(
        'User not found in request',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const userId = userPayload.user_id;
    const menus = await this.routeService.getRouters(userId);
    return new ApiResponse(HttpStatus.OK, 'Get routers successful', menus);
  }
}

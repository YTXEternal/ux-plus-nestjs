import {
  Controller,
  Get,
  Req,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse as ApiSwaggerResponse,
} from '@nestjs/swagger';
import { RouteService } from './route.service';
import { Request } from 'express';
import { ApiResponse } from '@/dto/api-response';
import { RouterResult, UserRoutesResult } from '@/routes/auth/dto/auth.dto';

@ApiTags('路由管理')
@Controller({
  path: 'route',
  version: '1',
})
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @ApiOperation({ summary: '获取路由信息' })
  @ApiSwaggerResponse({ type: RouterResult })
  @Get('/getReactUserRoutes')
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
    const result = {
      home: '/home',
      routes: menus,
    };
    return new ApiResponse(HttpStatus.OK, 'Get routers successful', result);
  }

  @ApiOperation({ summary: '获取用户路由' })
  @ApiSwaggerResponse({ type: UserRoutesResult })
  @Get('/getUserRoutes')
  async getUserRoutes(@Req() request: Request) {
    const userPayload = (request as any).user;
    if (!userPayload) {
      throw new HttpException(
        'User not found in request',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const userId = userPayload.user_id;
    const result = await this.routeService.getUserRoutes(userId);
    return new ApiResponse(HttpStatus.OK, 'Get user routes successful', result);
  }

  @ApiOperation({ summary: '检查路由是否存在' })
  @ApiQuery({ name: 'routeName', required: true, description: '路由名称' })
  @ApiSwaggerResponse({ type: Boolean })
  @Get('/isRouteExist')
  async isRouteExist(@Query('routeName') routeName: string) {
    if (!routeName) {
      throw new HttpException('routeName is required', HttpStatus.BAD_REQUEST);
    }
    const result = await this.routeService.isRouteExist(routeName);
    return new ApiResponse(
      HttpStatus.OK,
      'Check route exist successful',
      result,
    );
  }
}

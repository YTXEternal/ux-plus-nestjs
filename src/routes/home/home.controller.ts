import { Controller, Get, Query, UseGuards, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse as ApiSwaggerResponse,
} from '@nestjs/swagger';
import { HomeService } from './home.service';
import { RequirePermissions, PermissionsGuard, AuthTokenGuard } from '@/guards';
import { ApiResponse } from '@/dto/api-response';

@ApiTags('首页统计')
@Controller('home')
@UseGuards(AuthTokenGuard, PermissionsGuard)
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('statistics')
  @RequirePermissions('home')
  @ApiOperation({ summary: '获取首页统计数据 (ECharts)' })
  @ApiQuery({ name: 'shop_id', required: false, description: '店铺ID' })
  @ApiQuery({
    name: 'days',
    required: false,
    description: '统计天数 (7, 14, 30)，默认 7',
    example: 7,
  })
  @ApiSwaggerResponse({
    status: 200,
    description: '成功返回 ECharts 格式数据',
    type: ApiResponse,
  })
  async getStatistics(
    @Query('shop_id') shop_id?: number,
    @Query('days') days?: number,
  ) {
    const data = await this.homeService.getStatistics({
      shop_id,
      days: days ? Number(days) : 7,
    });
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

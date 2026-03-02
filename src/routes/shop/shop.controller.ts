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
import {
  ApiTags,
  ApiOperation,
  ApiResponse as ApiSwaggerResponse,
} from '@nestjs/swagger';
import { ShopService } from './shop.service';
import { ApiResponse } from '@/dto/api-response';
import {
  CreateShopDto,
  UpdateShopDto,
  ListShopDto,
  DeleteShopDto,
} from './dto/shop.dto';
import { formatPagination } from '@/tools';

@ApiTags('门店管理')
@Controller({
  path: 'shop',
  version: '1',
})
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @ApiOperation({ summary: '新增门店' })
  @ApiSwaggerResponse({
    status: 200,
    description: '新增成功',
    type: ApiResponse,
  })
  @Post()
  async create(@Body() body: CreateShopDto) {
    const data = await this.shopService.create(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '删除门店' })
  @ApiSwaggerResponse({
    status: 200,
    description: '删除成功',
    type: ApiResponse,
  })
  @Delete()
  async remove(@Body() body: DeleteShopDto) {
    await this.shopService.delete(body.shop_ids);
    return new ApiResponse(HttpStatus.OK, '删除成功', null);
  }

  @ApiOperation({ summary: '修改门店信息' })
  @ApiSwaggerResponse({
    status: 200,
    description: '修改成功',
    type: ApiResponse,
  })
  @Put()
  async update(@Body() body: UpdateShopDto) {
    const data = await this.shopService.update(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '获取门店列表' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @Get('list')
  async findAll(@Query() query: ListShopDto) {
    const { rows, total } = await this.shopService.findAll(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '获取门店详情' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.shopService.findOne(+id);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

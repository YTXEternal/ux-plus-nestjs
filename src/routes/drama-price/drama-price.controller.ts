import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DramaPriceService } from './drama-price.service';
import {
  CreateDramaPriceDto,
  ListDramaPriceDto,
  UpdateDramaPriceDto,
} from './dto/drama-price.dto';
import { Request } from 'express';
import { ApiResponse } from '@/dto/api-response';

@ApiTags('剧本定价')
@Controller({
  path: 'drama-price',
  version: '1',
})
export class DramaPriceController {
  constructor(private readonly dramaPriceService: DramaPriceService) {}

  @ApiOperation({ summary: '新增定价' })
  @Post()
  async create(@Body() createDto: CreateDramaPriceDto, @Req() req: Request) {
    const data = await this.dramaPriceService.create(createDto, req);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '删除定价' })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.dramaPriceService.remove(id);
    return new ApiResponse(HttpStatus.OK, '删除成功', null);
  }

  @ApiOperation({ summary: '修改定价' })
  @Put()
  async update(@Body() updateDto: UpdateDramaPriceDto) {
    const data = await this.dramaPriceService.update(updateDto);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '定价详情' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.dramaPriceService.findOne(id);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '定价列表' })
  @Get()
  async findAll(@Query() query: ListDramaPriceDto) {
    const data = await this.dramaPriceService.findAll(query);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

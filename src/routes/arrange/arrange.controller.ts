import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as ApiSwaggerResponse,
} from '@nestjs/swagger';
import { ArrangeService } from './arrange.service';
import {
  CreateArrangeDto,
  ListArrangeDto,
  UpdateArrangeDto,
} from './dto/arrange.dto';
import { ApiResponse } from '@/dto/api-response';
import { formatPagination } from '@/tools';

@ApiTags('排场管理')
@Controller({
  path: 'arrange',
  version: '1',
})
export class ArrangeController {
  constructor(private readonly arrangeService: ArrangeService) {}

  @ApiOperation({ summary: '新增排场' })
  @Post()
  async create(@Body() createArrangeDto: CreateArrangeDto) {
    const data = await this.arrangeService.create(createArrangeDto);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '排场列表' })
  @Get('list')
  async findAll(@Query() query: ListArrangeDto) {
    const { rows, total } = await this.arrangeService.findAll(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '排场列表(无分页)' })
  @Get('all')
  async findAllNoPage(@Query() query: ListArrangeDto) {
    const data = await this.arrangeService.findAllNoPage(query);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '排场详情' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.arrangeService.findOne(+id);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '修改排场' })
  @Put()
  async update(@Body() updateArrangeDto: UpdateArrangeDto) {
    const data = await this.arrangeService.update(updateArrangeDto);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '删除排场' })
  @Delete(':ids')
  async remove(@Param('ids') ids: string) {
    await this.arrangeService.remove(ids.split(',').map((id) => +id));
    return new ApiResponse(HttpStatus.OK, '删除成功', null);
  }
}

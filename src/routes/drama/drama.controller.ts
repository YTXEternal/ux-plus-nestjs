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
import { DramaService } from './drama.service';
import { ApiResponse } from '@/dto/api-response';
import {
  CreateDramaDto,
  UpdateDramaDto,
  ListDramaDto,
  DeleteDramaDto,
  UpdateDramaStatusDto,
} from './dto/drama.dto';
import { formatPagination } from '@/tools';
import { RequirePermissions } from '@/guards';

@ApiTags('剧本管理')
@Controller({
  path: 'drama',
  version: '1',
})
export class DramaController {
  constructor(private readonly dramaService: DramaService) {}

  @RequirePermissions('drama:add')
  @ApiOperation({ summary: '新增剧本' })
  @ApiSwaggerResponse({
    status: 200,
    description: '新增成功',
    type: ApiResponse,
  })
  @Post()
  async create(@Body() body: CreateDramaDto) {
    const data = await this.dramaService.create(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('drama:remove')
  @ApiOperation({ summary: '删除剧本' })
  @ApiSwaggerResponse({
    status: 200,
    description: '删除成功',
    type: ApiResponse,
  })
  @Delete()
  async remove(@Body() body: DeleteDramaDto) {
    await this.dramaService.remove(body.event_ids);
    return new ApiResponse(HttpStatus.OK, '删除成功', null);
  }

  @RequirePermissions('drama:edit')
  @ApiOperation({ summary: '修改剧本信息' })
  @ApiSwaggerResponse({
    status: 200,
    description: '修改成功',
    type: ApiResponse,
  })
  @Put()
  async update(@Body() body: UpdateDramaDto) {
    const data = await this.dramaService.update(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('drama:edit')
  @ApiOperation({ summary: '修改剧本状态' })
  @ApiSwaggerResponse({
    status: 200,
    description: '修改成功',
    type: ApiResponse,
  })
  @Put('status')
  async updateStatus(@Body() body: UpdateDramaStatusDto) {
    await this.dramaService.updateStatus(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', null);
  }

  @RequirePermissions('drama:list')
  @ApiOperation({ summary: '获取剧本列表' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @Get('list')
  async findAll(@Query() query: ListDramaDto) {
    const { rows, total } = await this.dramaService.findAll(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('drama:query')
  @ApiOperation({ summary: '获取剧本详情' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.dramaService.findOne(+id);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

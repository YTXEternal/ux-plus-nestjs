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
import { LabelService } from './label.service';
import { ApiResponse } from '@/dto/api-response';
import {
  CreateLabelDto,
  UpdateLabelDto,
  ListLabelDto,
  DeleteLabelDto,
  ChangeStatusLabelDto,
} from './dto/label.dto';
import { formatPagination } from '@/tools';
import { RequirePermissions } from '@/guards';

@ApiTags('标签管理')
@Controller({
  path: 'label',
  version: '1',
})
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @ApiOperation({ summary: '新增标签' })
  @ApiSwaggerResponse({
    status: 200,
    description: '新增成功',
    type: ApiResponse,
  })
  @RequirePermissions('label:add')
  @Post()
  async create(@Body() body: CreateLabelDto) {
    const data = await this.labelService.create(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('label:remove')
  @ApiOperation({ summary: '删除标签' })
  @ApiSwaggerResponse({
    status: 200,
    description: '删除成功',
    type: ApiResponse,
  })
  @Delete()
  async remove(@Body() body: DeleteLabelDto) {
    await this.labelService.delete(body.label_ids);
    return new ApiResponse(HttpStatus.OK, '删除成功', null);
  }
  @RequirePermissions('label:edit')
  @ApiOperation({ summary: '修改标签信息' })
  @ApiSwaggerResponse({
    status: 200,
    description: '修改成功',
    type: ApiResponse,
  })
  @Put()
  async update(@Body() body: UpdateLabelDto) {
    const data = await this.labelService.update(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('label:edit')
  @ApiOperation({ summary: '修改标签状态' })
  @ApiSwaggerResponse({
    status: 200,
    description: '修改成功',
    type: ApiResponse,
  })
  @Put('changeStatus')
  async changeStatus(@Body() body: ChangeStatusLabelDto) {
    await this.labelService.changeStatus(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', null);
  }

  @RequirePermissions('label:list')
  @ApiOperation({ summary: '获取标签列表' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @Get('list')
  async findAll(@Query() query: ListLabelDto) {
    const { rows, total } = await this.labelService.findAll(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '获取标签详情' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @RequirePermissions('label:query')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.labelService.findOne(+id);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

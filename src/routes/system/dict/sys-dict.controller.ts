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
  ApiParam,
} from '@nestjs/swagger';
import { SysDictService } from './sys-dict.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';
import { formatPagination } from '@/tools';

import {
  ListDictTypeDto,
  GetDictTypeParamDto,
  GetDictDataParamDto,
  GetDictDataByTypeParamDto,
  CreateDictTypeDto,
  UpdateDictTypeDto,
  ListDictDataDto,
  CreateDictDataDto,
  UpdateDictDataDto,
  DeleteDictTypeDto,
  DeleteDictDataDto,
} from './dto/sys-dict.dto';

@ApiTags('系统管理-字典管理')
@Controller({
  path: 'system/dict',
  version: '1',
})
export class SysDictController {
  constructor(private readonly sysDictService: SysDictService) {}

  // Type
  @ApiOperation({ summary: '获取字典类型列表' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:dict:list')
  @Get('type/list')
  async findAllType(@Query() query: ListDictTypeDto) {
    const { rows, total } = await this.sysDictService.findAllType(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '获取字典类型详情' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @ApiParam({ name: 'dictId', description: '字典ID', example: 1 })
  @RequirePermissions('system:dict:query')
  @Get('type/:dictId')
  async findType(@Param() params: GetDictTypeParamDto) {
    const data = await this.sysDictService.findType(params.dictId);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '新增字典类型' })
  @ApiSwaggerResponse({
    status: 200,
    description: '新增成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:dict:add')
  @Post('type')
  async createType(@Body() body: CreateDictTypeDto) {
    const data = await this.sysDictService.createType(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '修改字典类型' })
  @ApiSwaggerResponse({
    status: 200,
    description: '修改成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:dict:edit')
  @Put('type')
  async updateType(@Body() body: UpdateDictTypeDto) {
    const data = await this.sysDictService.updateType(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '删除字典类型' })
  @ApiSwaggerResponse({
    status: 200,
    description: '删除成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:dict:remove')
  @Delete('type')
  async removeType(@Body() body: DeleteDictTypeDto) {
    const data = await this.sysDictService.deleteType(body.dict_ids.join(','));
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  // Data
  @ApiOperation({ summary: '获取字典数据列表' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:dict:list')
  @Get('data/list')
  async findAllData(@Query() query: ListDictDataDto) {
    const { rows, total } = await this.sysDictService.findAllData(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '获取字典数据详情' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @ApiParam({ name: 'dictCode', description: '字典编码', example: 1 })
  @RequirePermissions('system:dict:query')
  @Get('data/:dictCode')
  async findData(@Param() params: GetDictDataParamDto) {
    const data = await this.sysDictService.findData(params.dictCode);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '根据字典类型获取数据' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @ApiParam({
    name: 'dictType',
    description: '字典类型',
    example: 'sys_user_sex',
  })
  @RequirePermissions('system:dict:list')
  @Get('data/type/:dictType')
  async findDataByType(@Param() params: GetDictDataByTypeParamDto) {
    const data = await this.sysDictService.findDataByType(params.dictType);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '新增字典数据' })
  @ApiSwaggerResponse({
    status: 200,
    description: '新增成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:dict:add')
  @Post('data')
  async createData(@Body() body: CreateDictDataDto) {
    const data = await this.sysDictService.createData(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '修改字典数据' })
  @ApiSwaggerResponse({
    status: 200,
    description: '修改成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:dict:edit')
  @Put('data')
  async updateData(@Body() body: UpdateDictDataDto) {
    const data = await this.sysDictService.updateData(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '删除字典数据' })
  @ApiSwaggerResponse({
    status: 200,
    description: '删除成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:dict:remove')
  @Delete('data')
  async removeData(@Body() body: DeleteDictDataDto) {
    const data = await this.sysDictService.deleteData(
      body.dict_codes.join(','),
    );
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

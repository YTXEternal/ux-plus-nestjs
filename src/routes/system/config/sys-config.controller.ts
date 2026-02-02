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
import { SysConfigService } from './sys-config.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';
import { formatPagination } from '@/tools';

import {
  ListConfigDto,
  GetConfigParamDto,
  GetConfigKeyParamDto,
  CreateConfigDto,
  UpdateConfigDto,
  DeleteConfigDto,
} from './dto/sys-config.dto';

@ApiTags('系统管理-参数配置')
@Controller({
  path: 'system/config',
  version: '1',
})
export class SysConfigController {
  constructor(private readonly sysConfigService: SysConfigService) {}

  @ApiOperation({ summary: '获取参数列表' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:config:list')
  @Get('list')
  async findAll(@Query() query: ListConfigDto) {
    const { rows, total } = await this.sysConfigService.findAll(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '获取参数详情' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @ApiParam({ name: 'configId', description: '参数ID', example: 1 })
  @RequirePermissions('system:config:query')
  @Get(':configId')
  async findOne(@Param() params: GetConfigParamDto) {
    const data = await this.sysConfigService.findOne(params.configId);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '根据键名获取参数' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @ApiParam({
    name: 'configKey',
    description: '参数键名',
    example: 'sys.index.skinName',
  })
  @RequirePermissions('system:config:query')
  @Get('configKey/:configKey')
  async findByKey(@Param() params: GetConfigKeyParamDto) {
    const data = await this.sysConfigService.findByKey(params.configKey);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '新增参数' })
  @ApiSwaggerResponse({
    status: 200,
    description: '新增成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:config:add')
  @Post()
  async create(@Body() body: CreateConfigDto) {
    const data = await this.sysConfigService.create(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '修改参数' })
  @ApiSwaggerResponse({
    status: 200,
    description: '修改成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:config:edit')
  @Put()
  async update(@Body() body: UpdateConfigDto) {
    const data = await this.sysConfigService.update(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '删除参数' })
  @ApiSwaggerResponse({
    status: 200,
    description: '删除成功',
    type: ApiResponse,
  })
  @RequirePermissions('system:config:remove')
  @Delete()
  async remove(@Body() body: DeleteConfigDto) {
    const data = await this.sysConfigService.delete(body.config_ids.join(','));
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

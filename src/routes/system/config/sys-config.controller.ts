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
import { SysConfigService } from './sys-config.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';
import { formatPagination } from '@/tools';

import {
  ListConfigDto,
  CreateConfigDto,
  UpdateConfigDto,
} from './dto/sys-config.dto';

@Controller({
  path: 'system/config',
  version: '1',
})
export class SysConfigController {
  constructor(private readonly sysConfigService: SysConfigService) {}

  @RequirePermissions('system:config:list')
  @Get('list')
  async findAll(@Query() query: ListConfigDto) {
    const { rows, total } = await this.sysConfigService.findAll(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:config:query')
  @Get(':configId')
  async findOne(@Param('configId') configId: string) {
    const data = await this.sysConfigService.findOne(+configId);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:config:query')
  @Get('configKey/:configKey')
  async findByKey(@Param('configKey') configKey: string) {
    const data = await this.sysConfigService.findByKey(configKey);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:config:add')
  @Post()
  async create(@Body() body: CreateConfigDto) {
    const data = await this.sysConfigService.create(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:config:edit')
  @Put()
  async update(@Body() body: UpdateConfigDto) {
    const data = await this.sysConfigService.update(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:config:remove')
  @Delete()
  async remove(@Body() body: { config_ids: number[] }) {
    const data = await this.sysConfigService.delete(body.config_ids.join(','));
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

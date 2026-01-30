import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
} from '@nestjs/common';
import { SysConfigService } from './sys-config.service';
import { RequirePermissions } from '@/guards';

@Controller({
  path: 'system/config',
  version: '1',
})
export class SysConfigController {
  constructor(private readonly sysConfigService: SysConfigService) {}

  @RequirePermissions('system:config:list')
  @Get('list')
  findAll(@Query() query: any) {
    return this.sysConfigService.findAll(query);
  }

  @RequirePermissions('system:config:query')
  @Get(':configId')
  findOne(@Param('configId') configId: string) {
    return this.sysConfigService.findOne(+configId);
  }

  @RequirePermissions('system:config:query')
  @Get('configKey/:configKey')
  findByKey(@Param('configKey') configKey: string) {
    return this.sysConfigService.findByKey(configKey);
  }

  @RequirePermissions('system:config:add')
  @Post()
  create(@Body() body: any) {
    return this.sysConfigService.create(body);
  }

  @RequirePermissions('system:config:edit')
  @Put()
  update(@Body() body: any) {
    return this.sysConfigService.update(body);
  }

  @RequirePermissions('system:config:remove')
  @Delete(':configIds')
  remove(@Param('configIds') configIds: string) {
    return this.sysConfigService.delete(configIds);
  }
}

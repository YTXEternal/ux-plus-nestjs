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

@Controller('system/config')
export class SysConfigController {
  constructor(private readonly sysConfigService: SysConfigService) {}

  @Get('list')
  findAll(@Query() query: any) {
    return this.sysConfigService.findAll(query);
  }

  @Get(':configId')
  findOne(@Param('configId') configId: string) {
    return this.sysConfigService.findOne(+configId);
  }

  @Get('configKey/:configKey')
  findByKey(@Param('configKey') configKey: string) {
    return this.sysConfigService.findByKey(configKey);
  }

  @Post()
  create(@Body() body: any) {
    return this.sysConfigService.create(body);
  }

  @Put()
  update(@Body() body: any) {
    return this.sysConfigService.update(body);
  }

  @Delete(':configIds')
  remove(@Param('configIds') configIds: string) {
    return this.sysConfigService.delete(configIds);
  }
}

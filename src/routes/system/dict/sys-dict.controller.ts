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
import { SysDictService } from './sys-dict.service';
import { RequirePermissions } from '@/guards';

@Controller({
  path: 'system/dict',
  version: '1',
})
export class SysDictController {
  constructor(private readonly sysDictService: SysDictService) {}

  // Type
  @RequirePermissions('system:dict:list')
  @Get('type/list')
  findAllType(@Query() query: any) {
    return this.sysDictService.findAllType(query);
  }

  @RequirePermissions('system:dict:query')
  @Get('type/:dictId')
  findType(@Param('dictId') dictId: string) {
    return this.sysDictService.findType(+dictId);
  }

  @RequirePermissions('system:dict:add')
  @Post('type')
  createType(@Body() body: any) {
    return this.sysDictService.createType(body);
  }

  @RequirePermissions('system:dict:edit')
  @Put('type')
  updateType(@Body() body: any) {
    return this.sysDictService.updateType(body);
  }

  @RequirePermissions('system:dict:remove')
  @Delete('type/:dictIds')
  removeType(@Param('dictIds') dictIds: string) {
    return this.sysDictService.deleteType(dictIds);
  }

  // Data
  @RequirePermissions('system:dict:list')
  @Get('data/list')
  findAllData(@Query() query: any) {
    return this.sysDictService.findAllData(query);
  }

  @RequirePermissions('system:dict:query')
  @Get('data/:dictCode')
  findData(@Param('dictCode') dictCode: string) {
    return this.sysDictService.findData(+dictCode);
  }

  @RequirePermissions('system:dict:list')
  @Get('data/type/:dictType')
  findDataByType(@Param('dictType') dictType: string) {
    return this.sysDictService.findDataByType(dictType);
  }

  @RequirePermissions('system:dict:add')
  @Post('data')
  createData(@Body() body: any) {
    return this.sysDictService.createData(body);
  }

  @RequirePermissions('system:dict:edit')
  @Put('data')
  updateData(@Body() body: any) {
    return this.sysDictService.updateData(body);
  }

  @RequirePermissions('system:dict:remove')
  @Delete('data/:dictCodes')
  removeData(@Param('dictCodes') dictCodes: string) {
    return this.sysDictService.deleteData(dictCodes);
  }
}

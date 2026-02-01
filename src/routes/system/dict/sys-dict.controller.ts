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
import { SysDictService } from './sys-dict.service';
import { RequirePermissions } from '@/guards';
import { ApiResponse } from '@/dto/api-response';

import {
  ListDictTypeDto,
  CreateDictTypeDto,
  UpdateDictTypeDto,
  ListDictDataDto,
  CreateDictDataDto,
  UpdateDictDataDto,
} from './dto/sys-dict.dto';

@Controller({
  path: 'system/dict',
  version: '1',
})
export class SysDictController {
  constructor(private readonly sysDictService: SysDictService) {}

  // Type
  @RequirePermissions('system:dict:list')
  @Get('type/list')
  async findAllType(@Query() query: ListDictTypeDto) {
    const data = await this.sysDictService.findAllType(query);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:dict:query')
  @Get('type/:dictId')
  async findType(@Param('dictId') dictId: string) {
    const data = await this.sysDictService.findType(+dictId);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:dict:add')
  @Post('type')
  async createType(@Body() body: CreateDictTypeDto) {
    const data = await this.sysDictService.createType(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:dict:edit')
  @Put('type')
  async updateType(@Body() body: UpdateDictTypeDto) {
    const data = await this.sysDictService.updateType(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:dict:remove')
  @Delete('type/:dictIds')
  async removeType(@Param('dictIds') dictIds: string) {
    const data = await this.sysDictService.deleteType(dictIds);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  // Data
  @RequirePermissions('system:dict:list')
  @Get('data/list')
  async findAllData(@Query() query: ListDictDataDto) {
    const data = await this.sysDictService.findAllData(query);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:dict:query')
  @Get('data/:dictCode')
  async findData(@Param('dictCode') dictCode: string) {
    const data = await this.sysDictService.findData(+dictCode);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:dict:list')
  @Get('data/type/:dictType')
  async findDataByType(@Param('dictType') dictType: string) {
    const data = await this.sysDictService.findDataByType(dictType);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:dict:add')
  @Post('data')
  async createData(@Body() body: CreateDictDataDto) {
    const data = await this.sysDictService.createData(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:dict:edit')
  @Put('data')
  async updateData(@Body() body: UpdateDictDataDto) {
    const data = await this.sysDictService.updateData(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('system:dict:remove')
  @Delete('data/:dictCodes')
  async removeData(@Param('dictCodes') dictCodes: string) {
    const data = await this.sysDictService.deleteData(dictCodes);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}

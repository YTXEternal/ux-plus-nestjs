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

@Controller('system/dict')
export class SysDictController {
  constructor(private readonly sysDictService: SysDictService) {}

  // Type
  @Get('type/list')
  findAllType(@Query() query: any) {
    return this.sysDictService.findAllType(query);
  }

  @Get('type/:dictId')
  findType(@Param('dictId') dictId: string) {
    return this.sysDictService.findType(+dictId);
  }

  @Post('type')
  createType(@Body() body: any) {
    return this.sysDictService.createType(body);
  }

  @Put('type')
  updateType(@Body() body: any) {
    return this.sysDictService.updateType(body);
  }

  @Delete('type/:dictIds')
  removeType(@Param('dictIds') dictIds: string) {
    return this.sysDictService.deleteType(dictIds);
  }

  // Data
  @Get('data/list')
  findAllData(@Query() query: any) {
    return this.sysDictService.findAllData(query);
  }

  @Get('data/:dictCode')
  findData(@Param('dictCode') dictCode: string) {
    return this.sysDictService.findData(+dictCode);
  }

  @Get('data/type/:dictType')
  findDataByType(@Param('dictType') dictType: string) {
    return this.sysDictService.findDataByType(dictType);
  }

  @Post('data')
  createData(@Body() body: any) {
    return this.sysDictService.createData(body);
  }

  @Put('data')
  updateData(@Body() body: any) {
    return this.sysDictService.updateData(body);
  }

  @Delete('data/:dictCodes')
  removeData(@Param('dictCodes') dictCodes: string) {
    return this.sysDictService.deleteData(dictCodes);
  }
}

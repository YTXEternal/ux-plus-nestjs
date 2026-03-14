import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysDictService } from './sys-dict.service';
import { SysDictController } from './sys-dict.controller';
import { DictType } from '@/databases/mysql-database/model/dict-type.model';
import { DictData } from '@/databases/mysql-database/model/dict-data.model';

/**
 * 系统-字典模块
 *
 * 提供字典类型与字典数据的管理接口与业务逻辑，并装配相关模型。
 *
 * @export
 * @class SysDictModule
 * @typedef {SysDictModule}
 */
@Module({
  imports: [SequelizeModule.forFeature([DictType, DictData])],
  controllers: [SysDictController],
  providers: [SysDictService],
})
export class SysDictModule {}

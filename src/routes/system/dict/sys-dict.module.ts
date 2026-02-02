import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysDictService } from './sys-dict.service';
import { SysDictController } from './sys-dict.controller';
import { SysDictType } from '@/databases/mysql-database/model/sys-dict-type.model';
import { SysDictData } from '@/databases/mysql-database/model/sys-dict-data.model';

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
  imports: [SequelizeModule.forFeature([SysDictType, SysDictData])],
  controllers: [SysDictController],
  providers: [SysDictService],
})
export class SysDictModule {}

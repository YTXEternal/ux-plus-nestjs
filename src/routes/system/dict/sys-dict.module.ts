import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysDictService } from './sys-dict.service';
import { SysDictController } from './sys-dict.controller';
import { SysDictType } from '@/databases/mysql-database/model/sys-dict-type.model';
import { SysDictData } from '@/databases/mysql-database/model/sys-dict-data.model';

@Module({
  imports: [SequelizeModule.forFeature([SysDictType, SysDictData])],
  controllers: [SysDictController],
  providers: [SysDictService],
})
export class SysDictModule {}

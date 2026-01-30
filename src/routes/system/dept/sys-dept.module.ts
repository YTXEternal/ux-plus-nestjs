import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysDeptService } from './sys-dept.service';
import { SysDeptController } from './sys-dept.controller';
import { SysDept } from '@/databases/mysql-database/model/sys-dept.model';

@Module({
  imports: [SequelizeModule.forFeature([SysDept])],
  controllers: [SysDeptController],
  providers: [SysDeptService],
})
export class SysDeptModule {}

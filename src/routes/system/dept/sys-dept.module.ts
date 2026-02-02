import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysDeptService } from './sys-dept.service';
import { SysDeptController } from './sys-dept.controller';
import { SysDept } from '@/databases/mysql-database/model/sys-dept.model';

/**
 * 系统-部门模块
 *
 * 提供部门管理相关接口与业务逻辑，并装配部门模型。
 *
 * @export
 * @class SysDeptModule
 * @typedef {SysDeptModule}
 */
@Module({
  imports: [SequelizeModule.forFeature([SysDept])],
  controllers: [SysDeptController],
  providers: [SysDeptService],
})
export class SysDeptModule {}

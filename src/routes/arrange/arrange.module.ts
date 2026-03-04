import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ArrangeService } from './arrange.service';
import { ArrangeController } from './arrange.controller';
import { Arrange } from '@/databases/mysql-database/model/arrange.model';

@Module({
  imports: [SequelizeModule.forFeature([Arrange])],
  controllers: [ArrangeController],
  providers: [ArrangeService],
  exports: [ArrangeService],
})
export class ArrangeModule {}

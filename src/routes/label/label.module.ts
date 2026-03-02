import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LabelService } from './label.service';
import { LabelController } from './label.controller';
import { Label } from '@/databases/mysql-database/model/label.model';

@Module({
  imports: [SequelizeModule.forFeature([Label])],
  controllers: [LabelController],
  providers: [LabelService],
})
export class LabelModule {}

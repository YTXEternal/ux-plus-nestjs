import { Module } from '@nestjs/common';
import { DramaPriceService } from './drama-price.service';
import { DramaPriceController } from './drama-price.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysDramaPrice } from '@/databases/mysql-database/model/sys-drama-price.model';

@Module({
  imports: [SequelizeModule.forFeature([SysDramaPrice])],
  controllers: [DramaPriceController],
  providers: [DramaPriceService],
})
export class DramaPriceModule {}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { Shop } from '@/databases/mysql-database/model/shop.model';

@Module({
  imports: [SequelizeModule.forFeature([Shop])],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule {}

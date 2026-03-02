import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysDrama } from '@/databases/mysql-database/model/sys-drama.model';
import { Shop } from '@/databases/mysql-database/model/shop.model';
import { Label } from '@/databases/mysql-database/model/label.model';
import { DramaController } from './drama.controller';
import { DramaService } from './drama.service';

@Module({
  imports: [SequelizeModule.forFeature([SysDrama, Shop, Label])],
  controllers: [DramaController],
  providers: [DramaService],
})
export class DramaModule {}

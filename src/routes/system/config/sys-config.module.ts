import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysConfigService } from './sys-config.service';
import { SysConfigController } from './sys-config.controller';
import { SysConfig } from '@/databases/mysql-database/model/sys-config.model';

@Module({
  imports: [SequelizeModule.forFeature([SysConfig])],
  controllers: [SysConfigController],
  providers: [SysConfigService],
})
export class SysConfigModule {}

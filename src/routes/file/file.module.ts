import { Module } from '@nestjs/common';
import { SysFileService } from './file.service';
import { SysFileController } from './file.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysFile } from '@/databases/mysql-database/model/sys-file.model';

@Module({
  imports: [SequelizeModule.forFeature([SysFile])],
  controllers: [SysFileController],
  providers: [SysFileService],
})
export class SysFileModule {}

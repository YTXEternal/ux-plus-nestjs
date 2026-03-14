import { Module } from '@nestjs/common';
import { SysFileService } from './file.service';
import { SysFileController } from './file.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from '@/databases/mysql-database/model/file.model';

@Module({
  imports: [SequelizeModule.forFeature([File])],
  controllers: [SysFileController],
  providers: [SysFileService],
})
export class SysFileModule {}

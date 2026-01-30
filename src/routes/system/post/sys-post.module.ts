import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysPostService } from './sys-post.service';
import { SysPostController } from './sys-post.controller';
import { SysPost } from '@/databases/mysql-database/model/sys-post.model';

@Module({
  imports: [SequelizeModule.forFeature([SysPost])],
  controllers: [SysPostController],
  providers: [SysPostService],
})
export class SysPostModule {}

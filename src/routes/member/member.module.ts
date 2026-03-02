import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Member } from '@/databases/mysql-database/model/member.model';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';

@Module({
  imports: [SequelizeModule.forFeature([Member])],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { HomeStatistics } from '@/databases/mysql-database/model/home-statistics.model';
import { Ticket } from '@/databases/mysql-database/model/ticket.model';
import { Member } from '@/databases/mysql-database/model/member.model';
import { UxJwtModule } from '@/modules/ux-jwt/ux-jwt.module';
import { SysUserModule } from '@/routes/system/user/sys-user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([HomeStatistics, Ticket, Member]),
    UxJwtModule,
    SysUserModule,
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}

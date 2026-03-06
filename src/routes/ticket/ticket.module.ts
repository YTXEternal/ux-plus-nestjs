import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { Ticket } from '@/databases/mysql-database/model/ticket.model';
import { Arrange } from '@/databases/mysql-database/model/arrange.model';
import { Shop } from '@/databases/mysql-database/model/shop.model';
import { TicketExpireTaskService } from './ticket-expire-task.service';

@Module({
  imports: [SequelizeModule.forFeature([Ticket, Arrange, Shop])],
  controllers: [TicketController],
  providers: [TicketService, TicketExpireTaskService],
  exports: [TicketService],
})
export class TicketModule {}

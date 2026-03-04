import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { Ticket } from '@/databases/mysql-database/model/ticket.model';
import { Arrange } from '@/databases/mysql-database/model/arrange.model';

@Module({
  imports: [SequelizeModule.forFeature([Ticket, Arrange])],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService],
})
export class TicketModule {}

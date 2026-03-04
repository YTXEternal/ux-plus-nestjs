import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TicketRecordService } from './ticket-record.service';
import { TicketRecordController } from './ticket-record.controller';
import { TicketRecord } from '@/databases/mysql-database/model/ticket-record.model';
import { Ticket } from '@/databases/mysql-database/model/ticket.model';
import { Arrange } from '@/databases/mysql-database/model/arrange.model';

@Module({
  imports: [SequelizeModule.forFeature([TicketRecord, Ticket, Arrange])],
  controllers: [TicketRecordController],
  providers: [TicketRecordService],
  exports: [TicketRecordService],
})
export class TicketRecordModule {}

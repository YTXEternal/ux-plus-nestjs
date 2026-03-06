import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TicketService } from './ticket.service';

@Injectable()
export class TicketExpireTaskService {
  constructor(private readonly ticketService: TicketService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async expireUnpaidTickets() {
    await this.ticketService.expireUnpaidTickets();
  }
}

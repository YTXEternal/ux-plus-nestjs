export interface TicketRecordInter {
  record_id: number;
  ticket_id: number;
  type: string;
  amount: number;
  trade_no: string;
  status: string;
  create_time: Date;
  remark: string;
}

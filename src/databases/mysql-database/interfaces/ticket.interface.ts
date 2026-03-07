export interface TicketInter {
  ticket_id: number;
  member_id: number;
  arrange_id: number;
  shop_id: number;
  count: number;
  pay_amount: number;
  trade_no: string;
  pay_time: Date;
  status: string;
  create_time: Date;
  update_time: Date;
}

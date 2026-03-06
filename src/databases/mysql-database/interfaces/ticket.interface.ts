export interface TicketInter {
  ticket_id: number;
  member_id: number;
  arrange_id: number;
  shop_id: number;
  count: number;
  pay_amount: number;
  status: string;
  create_time: Date;
  update_time: Date;
}

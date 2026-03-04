import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Ticket } from './ticket.model';

@Table({ tableName: 'ticket_record', timestamps: false })
export class TicketRecord extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  record_id: number;

  @ForeignKey(() => Ticket)
  @Column({ comment: '购票ID' })
  ticket_id: number;

  @BelongsTo(() => Ticket)
  ticket: Ticket;

  @Column({ defaultValue: '1', comment: '类型（1支付 2退款）' })
  type: string;

  @Column({ type: DataType.DECIMAL(10, 2), comment: '金额' })
  amount: number;

  @Column({ comment: '支付宝流水号' })
  trade_no: string;

  @Column({ defaultValue: '1', comment: '状态（0失败 1成功）' })
  status: string;

  @Column({ type: DataType.DATE, comment: '创建时间' })
  create_time: Date;

  @Column({ comment: '备注' })
  remark: string;
}

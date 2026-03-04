import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Arrange } from './arrange.model';
import { Member } from './member.model';

@Table({ tableName: 'ticket', timestamps: false })
export class Ticket extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  ticket_id: number;

  @ForeignKey(() => Member)
  @Column({ type: DataType.BIGINT, comment: '会员ID' })
  member_id: number;

  @BelongsTo(() => Member)
  member: Member;

  @ForeignKey(() => Arrange)
  @Column({ comment: '排场ID' })
  arrange_id: number;

  @BelongsTo(() => Arrange)
  arrange: Arrange;

  @Column({ defaultValue: 1, comment: '购买张数' })
  count: number;

  @Column({ type: DataType.DECIMAL(10, 2), comment: '支付金额' })
  pay_amount: number;

  @Column({
    defaultValue: '0',
    comment: '状态（0未支付 1已支付 2已过期 3已退款）',
  })
  status: string;

  @Column({ type: DataType.DATE, comment: '购票时间' })
  ticket_time: Date;

  @Column({ type: DataType.DATE, comment: '创建时间' })
  create_time: Date;

  @Column({ type: DataType.DATE, comment: '更新时间' })
  update_time: Date;
}

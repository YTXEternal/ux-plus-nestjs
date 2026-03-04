import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { SysDrama } from './sys-drama.model';
import { Shop } from './shop.model';

@Table({ tableName: 'arrange', timestamps: false })
export class Arrange extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  arrange_id: number;

  @Column({ comment: '排场名称' })
  name: string;

  @ForeignKey(() => SysDrama)
  @Column({ type: DataType.BIGINT, comment: '剧本ID' })
  drama_id: number;

  @BelongsTo(() => SysDrama)
  drama: SysDrama;

  @ForeignKey(() => Shop)
  @Column({ type: DataType.BIGINT, comment: '门店ID' })
  shop_id: number;

  @BelongsTo(() => Shop)
  shop: Shop;

  @Column({ defaultValue: '0', comment: '删除标志（0代表存在 2代表删除）' })
  del_flag: string;

  @Column({ type: DataType.DECIMAL(10, 2), comment: '票价' })
  price: number;

  @Column({ type: DataType.DATE, comment: '开始时间' })
  start_time: Date;

  @Column({ type: DataType.DATE, comment: '结束时间' })
  end_time: Date;

  @Column({ comment: '总票数' })
  total_tickets: number;

  @Column({ comment: '剩余票数' })
  remaining_tickets: number;

  @Column({ type: DataType.DATE, comment: '创建时间' })
  create_time: Date;

  @Column({ type: DataType.DATE, comment: '更新时间' })
  update_time: Date;
}

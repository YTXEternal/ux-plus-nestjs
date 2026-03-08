import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Comment,
} from 'sequelize-typescript';

/**
 * 首页统计数据表
 * 对应数据库表: home_statistics
 */
@Table({
  tableName: 'home_statistics',
  timestamps: true,
  createdAt: 'create_time',
  updatedAt: false, // 不需要更新时间
  comment: '首页统计数据表',
})
export class HomeStatistics extends Model<HomeStatistics> {
  @PrimaryKey
  @AutoIncrement
  @Comment('ID')
  @Column(DataType.BIGINT)
  id: number;

  @Comment('店铺ID')
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  shop_id: number;

  @Comment('统计时间点')
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  stats_time: Date;

  @Comment('会员增长人数')
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  member_growth: number;

  @Comment('卖票营业额')
  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0.0,
  })
  ticket_sales: number;

  @Comment('退款金额')
  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0.0,
  })
  refund_amount: number;

  @Comment('退款单数')
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  refund_count: number;
}

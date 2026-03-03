import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Comment,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Shop } from './shop.model';
import { SysDrama } from './sys-drama.model';

@Table({
  tableName: 'sys_drama_price',
  timestamps: true,
  createdAt: 'create_time',
  updatedAt: 'update_time',
  comment: '剧本定价表',
})
export class SysDramaPrice extends Model<SysDramaPrice> {
  @PrimaryKey
  @AutoIncrement
  @Comment('主键')
  @Column(DataType.BIGINT)
  dramaprice_id: number;

  @ForeignKey(() => Shop)
  @Comment('店铺ID')
  @Column({ type: DataType.BIGINT, allowNull: false })
  shop_id: number;

  @BelongsTo(() => Shop)
  shop: Shop;

  @ForeignKey(() => SysDrama)
  @Comment('剧本ID')
  @Column({ type: DataType.BIGINT, allowNull: false })
  drama_id: number;

  @BelongsTo(() => SysDrama)
  drama: SysDrama;

  @Comment('价格')
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  price: number;

  @Comment('删除标志（0正常 2删除）')
  @Column({ type: DataType.CHAR(1), defaultValue: '0' })
  del_flag: string;
}

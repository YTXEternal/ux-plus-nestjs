import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  Comment,
  ForeignKey,
} from 'sequelize-typescript';
import { SysDrama } from './sys-drama.model';
import { Shop } from './shop.model';

@Table({
  tableName: 'sys_drama_shop',
  timestamps: false,
  comment: '剧本-门店关联表',
})
export class SysDramaShop extends Model<SysDramaShop> {
  @ForeignKey(() => SysDrama)
  @PrimaryKey
  @Comment('剧本ID')
  @Column(DataType.BIGINT)
  drama_id: number;

  @ForeignKey(() => Shop)
  @PrimaryKey
  @Comment('门店ID')
  @Column(DataType.BIGINT)
  shop_id: number;
}

import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Comment,
  BelongsTo,
} from 'sequelize-typescript';
import { SysUser } from './sys-user.model';

@Table({
  tableName: 'shop',
  timestamps: true,
  createdAt: 'create_time',
  updatedAt: 'update_time',
  comment: '门店信息表',
})
export class Shop extends Model<Shop> {
  @PrimaryKey
  @AutoIncrement
  @Comment('门店ID')
  @Column(DataType.BIGINT)
  shop_id: number;

  @Comment('门店名称')
  @Column({ type: DataType.STRING(30), allowNull: false, unique: true })
  name: string;

  @Comment('门店地址')
  @Column({ type: DataType.STRING(255), allowNull: false })
  address: string;

  @Comment('联系电话')
  @Column({ type: DataType.STRING(20), defaultValue: '' })
  phone: string;

  @Comment('删除标志（0代表存在 2代表删除）')
  @Column({ type: DataType.CHAR(1), defaultValue: '0' })
  del_flag: string;

  @Comment('管理人ID')
  @Column({ type: DataType.BIGINT, allowNull: false })
  conductor: number;

  @BelongsTo(() => SysUser, { foreignKey: 'conductor', targetKey: 'user_id' })
  manager: SysUser;
}

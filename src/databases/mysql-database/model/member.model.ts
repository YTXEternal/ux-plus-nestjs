import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Comment,
} from 'sequelize-typescript';

@Table({
  tableName: 'member',
  timestamps: true,
  createdAt: 'create_time',
  updatedAt: 'update_time',
  comment: '会员信息表',
})
export class Member extends Model<Member> {
  @PrimaryKey
  @AutoIncrement
  @Comment('会员ID')
  @Column(DataType.BIGINT)
  member_id: number;

  @Comment('会员姓名')
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  name: string;

  @Comment('联系电话')
  @Column({ type: DataType.STRING(20), defaultValue: '' })
  phone: string;

  @Comment('邮箱')
  @Column({ type: DataType.STRING(50), defaultValue: '' })
  email: string;

  @Comment('删除标志（0代表存在 2代表删除）')
  @Column({ type: DataType.CHAR(1), defaultValue: '0' })
  del_flag: string;

  @Comment('所属店铺ID')
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  shop_id: number;
}

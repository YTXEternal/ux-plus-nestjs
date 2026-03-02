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
  tableName: 'label',
  timestamps: true,
  createdAt: 'create_time',
  updatedAt: 'update_time',
  comment: '标签管理表',
})
export class Label extends Model<Label> {
  @PrimaryKey
  @AutoIncrement
  @Comment('标签ID')
  @Column(DataType.BIGINT)
  label_id: number;

  @Comment('标签名称')
  @Column({ type: DataType.STRING(30), allowNull: false, unique: true })
  name: string;

  @Comment('状态（0正常 1停用）')
  @Column({ type: DataType.CHAR(1), defaultValue: '0' })
  status: string;

  @Comment('删除标志（0代表存在 2代表删除）')
  @Column({ type: DataType.CHAR(1), defaultValue: '0' })
  del_flag: string;
}

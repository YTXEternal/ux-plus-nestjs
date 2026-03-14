import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Comment,
  CreatedAt,
  UpdatedAt,
  Unique,
} from 'sequelize-typescript';

@Table({
  tableName: 'dict_type',
  timestamps: true,
  createdAt: 'create_time',
  updatedAt: 'update_time',
  comment: '字典类型表',
})
export class DictType extends Model<DictType> {
  @PrimaryKey
  @AutoIncrement
  @Comment('字典主键')
  @Column(DataType.BIGINT)
  dict_id: number;

  @Comment('字典名称')
  @Column({ type: DataType.STRING(100), defaultValue: '' })
  dict_name: string;

  @Unique
  @Comment('字典类型')
  @Column({ type: DataType.STRING(100), defaultValue: '' })
  dict_type: string;

  @Comment('状态（0正常 1停用）')
  @Column({ type: DataType.CHAR(1), defaultValue: '0' })
  status: string;

  @Comment('创建者')
  @Column({ type: DataType.STRING(64), defaultValue: '' })
  create_by: string;

  @Comment('更新者')
  @Column({ type: DataType.STRING(64), defaultValue: '' })
  update_by: string;

  @Comment('备注')
  @Column({ type: DataType.STRING(500), defaultValue: null })
  remark: string;

  @Comment('删除标志（0代表存在 2代表删除）')
  @Column({ type: DataType.CHAR(1), defaultValue: '0' })
  del_flag: string;
}

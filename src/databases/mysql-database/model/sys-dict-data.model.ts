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
} from 'sequelize-typescript';

@Table({
  tableName: 'sys_dict_data',
  timestamps: true,
  createdAt: 'create_time',
  updatedAt: 'update_time',
  comment: '字典数据表',
})
export class SysDictData extends Model<SysDictData> {
  @PrimaryKey
  @AutoIncrement
  @Comment('字典编码')
  @Column(DataType.BIGINT)
  dict_code: number;

  @Comment('字典排序')
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  dict_sort: number;

  @Comment('字典标签')
  @Column({ type: DataType.STRING(100), defaultValue: '' })
  dict_label: string;

  @Comment('字典键值')
  @Column({ type: DataType.STRING(100), defaultValue: '' })
  dict_value: string;

  @Comment('字典类型')
  @Column({ type: DataType.STRING(100), defaultValue: '' })
  dict_type: string;

  @Comment('样式属性（其他样式扩展）')
  @Column({ type: DataType.STRING(100), defaultValue: null })
  css_class: string;

  @Comment('表格回显样式')
  @Column({ type: DataType.STRING(100), defaultValue: null })
  list_class: string;

  @Comment('是否默认（Y是 N否）')
  @Column({ type: DataType.CHAR(1), defaultValue: 'N' })
  is_default: string;

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
}

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
  tableName: 'sys_config',
  timestamps: true,
  createdAt: 'create_time',
  updatedAt: 'update_time',
  comment: '参数配置表',
})
export class SysConfig extends Model<SysConfig> {
  @PrimaryKey
  @AutoIncrement
  @Comment('参数主键')
  @Column(DataType.INTEGER)
  config_id: number;

  @Comment('参数名称')
  @Column({ type: DataType.STRING(100), defaultValue: '' })
  config_name: string;

  @Comment('参数键名')
  @Column({ type: DataType.STRING(100), defaultValue: '' })
  config_key: string;

  @Comment('参数键值')
  @Column({ type: DataType.STRING(500), defaultValue: '' })
  config_value: string;

  @Comment('系统内置（Y是 N否）')
  @Column({ type: DataType.CHAR(1), defaultValue: 'N' })
  config_type: string;

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

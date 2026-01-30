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
  tableName: 'sys_logininfor',
  timestamps: false,
  comment: '系统访问记录',
})
export class SysLogininfor extends Model<SysLogininfor> {
  @PrimaryKey
  @AutoIncrement
  @Comment('访问ID')
  @Column(DataType.BIGINT)
  info_id: number;

  @Comment('用户账号')
  @Column({ type: DataType.STRING(50), defaultValue: '' })
  user_name: string;

  @Comment('登录IP地址')
  @Column({ type: DataType.STRING(128), defaultValue: '' })
  ipaddr: string;

  @Comment('登录地点')
  @Column({ type: DataType.STRING(255), defaultValue: '' })
  login_location: string;

  @Comment('浏览器类型')
  @Column({ type: DataType.STRING(50), defaultValue: '' })
  browser: string;

  @Comment('操作系统')
  @Column({ type: DataType.STRING(50), defaultValue: '' })
  os: string;

  @Comment('登录状态（0成功 1失败）')
  @Column({ type: DataType.CHAR(1), defaultValue: '0' })
  status: string;

  @Comment('提示消息')
  @Column({ type: DataType.STRING(255), defaultValue: '' })
  msg: string;

  @Comment('访问时间')
  @Column(DataType.DATE)
  login_time: Date;
}

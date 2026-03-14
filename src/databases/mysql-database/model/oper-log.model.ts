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
  tableName: 'oper_log',
  timestamps: false, // Only has oper_time, handled manually or mapped? design says oper_time
  comment: '操作日志记录',
})
export class OperLog extends Model<OperLog> {
  @PrimaryKey
  @AutoIncrement
  @Comment('日志主键')
  @Column(DataType.BIGINT)
  oper_id: number;

  @Comment('模块标题')
  @Column({ type: DataType.STRING(50), defaultValue: '' })
  title: string;

  @Comment('业务类型（0其它 1新增 2修改 3删除）')
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  business_type: number;

  @Comment('方法名称')
  @Column({ type: DataType.STRING(100), defaultValue: '' })
  method: string;

  @Comment('请求方式')
  @Column({ type: DataType.STRING(10), defaultValue: '' })
  request_method: string;

  @Comment('操作类别（0其它 1后台用户 2手机端用户）')
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  operator_type: number;

  @Comment('操作人员')
  @Column({ type: DataType.STRING(50), defaultValue: '' })
  oper_name: string;

  @Comment('部门名称')
  @Column({ type: DataType.STRING(50), defaultValue: '' })
  dept_name: string;

  @Comment('请求URL')
  @Column({ type: DataType.STRING(255), defaultValue: '' })
  oper_url: string;

  @Comment('主机地址')
  @Column({ type: DataType.STRING(128), defaultValue: '' })
  oper_ip: string;

  @Comment('操作地点')
  @Column({ type: DataType.STRING(255), defaultValue: '' })
  oper_location: string;

  @Comment('请求参数')
  @Column({ type: DataType.STRING(2000), defaultValue: '' })
  oper_param: string;

  @Comment('返回参数')
  @Column({ type: DataType.STRING(2000), defaultValue: '' })
  json_result: string;

  @Comment('操作状态（0正常 1异常）')
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  status: number;

  @Comment('错误消息')
  @Column({ type: DataType.STRING(2000), defaultValue: '' })
  error_msg: string;

  @Comment('操作时间')
  @Column(DataType.DATE)
  oper_time: Date;

  @Comment('消耗时间')
  @Column({ type: DataType.BIGINT, defaultValue: 0 })
  cost_time: number;
}

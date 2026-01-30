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
  tableName: 'sys_notice',
  timestamps: true,
  createdAt: 'create_time',
  updatedAt: 'update_time',
  comment: '通知公告表',
})
export class SysNotice extends Model<SysNotice> {
  @PrimaryKey
  @AutoIncrement
  @Comment('公告ID')
  @Column(DataType.INTEGER)
  notice_id: number;

  @Comment('公告标题')
  @Column({ type: DataType.STRING(50), allowNull: false })
  notice_title: string;

  @Comment('公告类型（1通知 2公告）')
  @Column({ type: DataType.CHAR(1), allowNull: false })
  notice_type: string;

  @Comment('公告内容')
  @Column({ type: DataType.BLOB('long'), defaultValue: null })
  notice_content: any;

  @Comment('公告状态（0正常 1关闭）')
  @Column({ type: DataType.CHAR(1), defaultValue: '0' })
  status: string;

  @Comment('创建者')
  @Column({ type: DataType.STRING(64), defaultValue: '' })
  create_by: string;

  @Comment('更新者')
  @Column({ type: DataType.STRING(64), defaultValue: '' })
  update_by: string;

  @Comment('备注')
  @Column({ type: DataType.STRING(255), defaultValue: null })
  remark: string;
}

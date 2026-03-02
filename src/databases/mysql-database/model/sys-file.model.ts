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
import { SysFileInter } from '../interfaces/sys-file.interface';

/**
 * 文件管理表
 * @class SysFile
 */
@Table({
  tableName: 'sys_file',
  timestamps: true,
  createdAt: 'create_time',
  updatedAt: 'update_time',
  comment: '文件管理表',
})
export class SysFile extends Model<SysFile> implements SysFileInter {
  @PrimaryKey
  @AutoIncrement
  @Comment('文件主键ID')
  @Column(DataType.BIGINT)
  file_id: number;

  @Comment('文件名称')
  @Column({ type: DataType.STRING(1024), allowNull: false })
  name: string;

  @Comment('文件类型')
  @Column({ type: DataType.STRING(50), defaultValue: '' })
  type: string;

  @Comment('文件路径')
  @Column({ type: DataType.STRING(1024), defaultValue: '' })
  url: string;

  @Comment('删除标志（0代表存在 2代表删除）')
  @Column({ type: DataType.CHAR(1), defaultValue: '0' })
  del_flag: string;

  @Comment('创建时间')
  @CreatedAt
  @Column(DataType.DATE)
  create_time: Date;

  @Comment('更新时间')
  @UpdatedAt
  @Column(DataType.DATE)
  update_time: Date;
}

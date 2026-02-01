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
  BelongsToMany,
} from 'sequelize-typescript';
import { SysUser } from './sys-user.model';
import { SysUserPost } from './sys-user-post.model';

@Table({
  tableName: 'sys_post',
  timestamps: true,
  createdAt: 'create_time',
  updatedAt: 'update_time',
  comment: '岗位信息表',
})
export class SysPost extends Model<SysPost> {
  @PrimaryKey
  @AutoIncrement
  @Comment('岗位ID')
  @Column(DataType.BIGINT)
  post_id: number;

  @Comment('岗位编码')
  @Column({ type: DataType.STRING(64), allowNull: false })
  post_code: string;

  @Comment('岗位名称')
  @Column({ type: DataType.STRING(50), allowNull: false })
  post_name: string;

  @Comment('显示顺序')
  @Column({ type: DataType.INTEGER, allowNull: false })
  post_sort: number;

  @Comment('状态（0正常 1停用）')
  @Column({ type: DataType.CHAR(1), allowNull: false })
  status: string;

  @Comment('删除标志（0代表存在，2代表删除）')
  @Column({ type: DataType.CHAR(1), defaultValue: '0' })
  del_flag: string;

  @Comment('创建者')
  @Column({ type: DataType.STRING(64), defaultValue: '' })
  create_by: string;

  @Comment('更新者')
  @Column({ type: DataType.STRING(64), defaultValue: '' })
  update_by: string;

  @Comment('备注')
  @Column({ type: DataType.STRING(500), defaultValue: null })
  remark: string;

  @BelongsToMany(() => SysUser, () => SysUserPost)
  users: SysUser[];
}

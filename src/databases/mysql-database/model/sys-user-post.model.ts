import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  Comment,
  ForeignKey,
} from 'sequelize-typescript';
import { SysUser } from './sys-user.model';
import { SysPost } from './sys-post.model';

@Table({
  tableName: 'sys_user_post',
  timestamps: false,
  comment: '用户与岗位关联表',
})
export class SysUserPost extends Model<SysUserPost> {
  @PrimaryKey
  @ForeignKey(() => SysUser)
  @Comment('用户ID')
  @Column(DataType.BIGINT)
  user_id: number;

  @PrimaryKey
  @ForeignKey(() => SysPost)
  @Comment('岗位ID')
  @Column(DataType.BIGINT)
  post_id: number;
}

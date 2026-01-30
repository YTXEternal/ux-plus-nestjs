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
import { SysRole } from './sys-role.model';

@Table({
  tableName: 'sys_user_role',
  timestamps: false,
  comment: '用户和角色关联表',
})
export class SysUserRole extends Model<SysUserRole> {
  @PrimaryKey
  @ForeignKey(() => SysUser)
  @Comment('用户ID')
  @Column(DataType.BIGINT)
  user_id: number;

  @PrimaryKey
  @ForeignKey(() => SysRole)
  @Comment('角色ID')
  @Column(DataType.BIGINT)
  role_id: number;
}

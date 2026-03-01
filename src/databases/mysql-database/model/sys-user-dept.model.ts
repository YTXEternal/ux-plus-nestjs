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
import { SysDept } from './sys-dept.model';

@Table({
  tableName: 'sys_user_dept',
  timestamps: false,
  comment: '用户和部门关联表',
})
export class SysUserDept extends Model<SysUserDept> {
  @PrimaryKey
  @ForeignKey(() => SysUser)
  @Comment('用户ID')
  @Column(DataType.BIGINT)
  user_id: number;

  @PrimaryKey
  @ForeignKey(() => SysDept)
  @Comment('部门ID')
  @Column(DataType.BIGINT)
  dept_id: number;
}

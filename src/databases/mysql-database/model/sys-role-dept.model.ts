import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  Comment,
  ForeignKey,
} from 'sequelize-typescript';
import { SysRole } from './sys-role.model';
import { SysDept } from './sys-dept.model';

@Table({
  tableName: 'sys_role_dept',
  timestamps: false,
  comment: '角色和部门关联表',
})
export class SysRoleDept extends Model<SysRoleDept> {
  @PrimaryKey
  @ForeignKey(() => SysRole)
  @Comment('角色ID')
  @Column(DataType.BIGINT)
  role_id: number;

  @PrimaryKey
  @ForeignKey(() => SysDept)
  @Comment('部门ID')
  @Column(DataType.BIGINT)
  dept_id: number;
}

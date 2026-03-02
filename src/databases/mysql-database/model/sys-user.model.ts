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
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { SysDept } from './sys-dept.model';
import { SysRole } from './sys-role.model';
import { SysUserRole } from './sys-user-role.model';
import { SysUserDept } from './sys-user-dept.model';

@Table({
  tableName: 'sys_user',
  timestamps: true,
  createdAt: 'create_time',
  updatedAt: 'update_time',
  comment: '用户信息表',
})
export class SysUser extends Model<SysUser> {
  @PrimaryKey
  @AutoIncrement
  @Comment('用户ID')
  @Column(DataType.BIGINT)
  user_id: number;

  @Comment('部门ID')
  @Column(DataType.BIGINT)
  dept_id: number;

  @Comment('用户账号')
  @Column({ type: DataType.STRING(30), allowNull: false })
  user_name: string;

  @Comment('用户昵称')
  @Column({ type: DataType.STRING(30), allowNull: false })
  nick_name: string;

  @Comment('用户类型（00系统用户）')
  @Column({ type: DataType.STRING(2), defaultValue: '00' })
  user_type: string;

  @Comment('用户邮箱')
  @Column({ type: DataType.STRING(50), defaultValue: '' })
  email: string;

  @Comment('手机号码')
  @Column({ type: DataType.STRING(11), defaultValue: '' })
  phonenumber: string;

  @Comment('用户性别（0男 1女 2未知）')
  @Column({ type: DataType.CHAR(1), defaultValue: '0' })
  sex: string;

  @Comment('头像地址')
  @Column({ type: DataType.STRING(100), defaultValue: '' })
  avatar: string;

  @Comment('密码')
  @Column({ type: DataType.TEXT, defaultValue: '' })
  password: string;

  @Comment('账号状态（0正常 1停用）')
  @Column({ type: DataType.CHAR(1), defaultValue: '0' })
  status: string;

  @Comment('删除标志（0代表存在 2代表删除）')
  @Column({ type: DataType.CHAR(1), defaultValue: '0' })
  del_flag: string;

  @Comment('最后登录IP')
  @Column({ type: DataType.STRING(128), defaultValue: '' })
  login_ip: string;

  @Comment('最后登录时间')
  @Column(DataType.DATE)
  login_date: Date;

  @Comment('密码最后更新时间')
  @Column(DataType.DATE)
  pwd_update_date: Date;

  @Comment('创建者')
  @Column({ type: DataType.STRING(64), defaultValue: '' })
  create_by: string;

  @Comment('更新者')
  @Column({ type: DataType.STRING(64), defaultValue: '' })
  update_by: string;

  @Comment('备注')
  @Column({ type: DataType.STRING(500), defaultValue: null })
  remark: string;

  @BelongsTo(() => SysDept, { foreignKey: 'dept_id', targetKey: 'dept_id' })
  dept: SysDept;

  @BelongsToMany(() => SysDept, { through: () => SysUserDept, as: 'depts' })
  depts: SysDept[];

  @BelongsToMany(() => SysRole, () => SysUserRole)
  roles: SysRole[];
}

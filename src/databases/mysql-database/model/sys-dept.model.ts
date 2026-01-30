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
  HasMany,
} from 'sequelize-typescript';
import { SysUser } from './sys-user.model';
import { SysRole } from './sys-role.model';

@Table({
  tableName: 'sys_dept',
  timestamps: true,
  createdAt: 'create_time',
  updatedAt: 'update_time',
  comment: '部门表',
})
export class SysDept extends Model<SysDept> {
  @PrimaryKey
  @AutoIncrement
  @Comment('部门id')
  @Column(DataType.BIGINT)
  dept_id: number;

  @Comment('父部门id')
  @Column({ type: DataType.BIGINT, defaultValue: 0 })
  parent_id: number;

  @Comment('祖级列表')
  @Column({ type: DataType.STRING(50), defaultValue: '' })
  ancestors: string;

  @Comment('部门名称')
  @Column({ type: DataType.STRING(30), defaultValue: '' })
  dept_name: string;

  @Comment('显示顺序')
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  order_num: number;

  @Comment('负责人')
  @Column({ type: DataType.STRING(20), defaultValue: null })
  leader: string;

  @Comment('联系电话')
  @Column({ type: DataType.STRING(11), defaultValue: null })
  phone: string;

  @Comment('邮箱')
  @Column({ type: DataType.STRING(50), defaultValue: null })
  email: string;

  @Comment('部门状态（0正常 1停用）')
  @Column({ type: DataType.CHAR(1), defaultValue: '0' })
  status: string;

  @Comment('删除标志（0代表存在 2代表删除）')
  @Column({ type: DataType.CHAR(1), defaultValue: '0' })
  del_flag: string;

  @Comment('创建者')
  @Column({ type: DataType.STRING(64), defaultValue: '' })
  create_by: string;

  @Comment('更新者')
  @Column({ type: DataType.STRING(64), defaultValue: '' })
  update_by: string;

  @HasMany(() => SysUser, { foreignKey: 'dept_id', sourceKey: 'dept_id' })
  users: SysUser[];
}

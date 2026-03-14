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
import { User } from './user.model';
import { UserRole } from './user-role.model';
import { Menu } from './menu.model';
import { RoleMenu } from './role-menu.model';
import { Dept } from './dept.model';

@Table({
  tableName: 'role',
  timestamps: true,
  createdAt: 'create_time',
  updatedAt: 'update_time',
  comment: '角色信息表',
})
export class Role extends Model<Role> {
  @PrimaryKey
  @AutoIncrement
  @Comment('角色ID')
  @Column(DataType.BIGINT)
  role_id: number;

  @Comment('角色名称')
  @Column({ type: DataType.STRING(30), allowNull: false })
  role_name: string;

  @Comment('角色权限字符串')
  @Column({ type: DataType.STRING(100), allowNull: false })
  role_key: string;

  @Comment('显示顺序')
  @Column({ type: DataType.INTEGER, allowNull: false })
  role_sort: number;

  @Comment(
    '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）',
  )
  @Column({ type: DataType.CHAR(1), defaultValue: '1' })
  data_scope: string;

  @Comment('菜单树选择项是否关联显示')
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  menu_check_strictly: boolean;

  @Comment('部门树选择项是否关联显示')
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  dept_check_strictly: boolean;

  @Comment('角色状态（0正常 1停用）')
  @Column({ type: DataType.CHAR(1), allowNull: false })
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

  @Comment('备注')
  @Column({ type: DataType.STRING(500), defaultValue: null })
  remark: string;

  @BelongsToMany(() => User, () => UserRole)
  users: User[];

  @BelongsToMany(() => Menu, () => RoleMenu)
  menus: Menu[];
}

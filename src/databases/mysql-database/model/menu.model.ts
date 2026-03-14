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
import { RoleMenu } from './role-menu.model';

@Table({
  tableName: 'menu',
  timestamps: true,
  createdAt: 'create_time',
  updatedAt: 'update_time',
  comment: '菜单权限表',
})
export class Menu extends Model<Menu> {
  @PrimaryKey
  @AutoIncrement
  @Comment('菜单ID')
  @Column(DataType.BIGINT)
  menu_id: number;

  @Comment('菜单名称')
  @Column({ type: DataType.STRING(50), allowNull: false })
  menu_name: string;

  @Comment('父菜单ID')
  @Column({ type: DataType.BIGINT, defaultValue: 0 })
  parent_id: number;

  @Comment('显示顺序')
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  order_num: number;

  @Comment('路由地址')
  @Column({ type: DataType.STRING(200), defaultValue: '' })
  path: string;

  @Comment('组件路径')
  @Column({ type: DataType.STRING(255), defaultValue: null })
  component: string;

  @Comment('路由参数')
  @Column({ type: DataType.STRING(255), defaultValue: null })
  query: string;

  @Comment('路由名称')
  @Column({ type: DataType.STRING(50), defaultValue: '' })
  route_name: string;

  @Comment('是否为外链（0是 1否）')
  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  is_frame: number;

  @Comment('是否缓存（0缓存 1不缓存）')
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  is_cache: number;

  @Comment('菜单类型（M目录 C菜单 F按钮）')
  @Column({ type: DataType.CHAR(1), defaultValue: '' })
  menu_type: string;

  @Comment('菜单状态（0显示 1隐藏）')
  @Column({ type: DataType.CHAR(1), defaultValue: '0' })
  visible: string;

  @Comment('菜单状态（0正常 1停用）')
  @Column({ type: DataType.CHAR(1), defaultValue: '0' })
  status: string;

  @Comment('权限标识')
  @Column({ type: DataType.STRING(100), defaultValue: null })
  perms: string;

  @Comment('菜单图标')
  @Column({ type: DataType.STRING(100), defaultValue: '#' })
  icon: string;

  @Comment('创建者')
  @Column({ type: DataType.STRING(64), defaultValue: '' })
  create_by: string;

  @Comment('更新者')
  @Column({ type: DataType.STRING(64), defaultValue: '' })
  update_by: string;

  @Comment('备注')
  @Column({ type: DataType.STRING(500), defaultValue: '' })
  remark: string;

  @Comment('是否为常量路由')
  @Column({ type: DataType.TINYINT, defaultValue: 0 })
  constant: boolean;

  @HasMany(() => RoleMenu)
  sysRoleMenus: RoleMenu[];
}

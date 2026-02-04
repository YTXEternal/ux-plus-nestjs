import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  Comment,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { SysRole } from './sys-role.model';
import { SysMenu } from './sys-menu.model';

@Table({
  tableName: 'sys_role_menu',
  timestamps: false,
  comment: '角色和菜单关联表',
})
export class SysRoleMenu extends Model<SysRoleMenu> {
  @PrimaryKey
  @ForeignKey(() => SysRole)
  @Comment('角色ID')
  @Column(DataType.BIGINT)
  role_id: number;

  @PrimaryKey
  @ForeignKey(() => SysMenu)
  @Comment('菜单ID')
  @Column(DataType.BIGINT)
  menu_id: number;

  @BelongsTo(() => SysMenu)
  sysMenu: SysMenu;

  @BelongsTo(() => SysRole)
  sysRole: SysRole;
}

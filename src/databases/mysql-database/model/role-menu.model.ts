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
import { Role } from './role.model';
import { Menu } from './menu.model';

@Table({
  tableName: 'role_menu',
  timestamps: false,
  comment: '角色和菜单关联表',
})
export class RoleMenu extends Model<RoleMenu> {
  @PrimaryKey
  @ForeignKey(() => Role)
  @Comment('角色ID')
  @Column(DataType.BIGINT)
  role_id: number;

  @PrimaryKey
  @ForeignKey(() => Menu)
  @Comment('菜单ID')
  @Column(DataType.BIGINT)
  menu_id: number;

  @BelongsTo(() => Menu)
  sysMenu: Menu;

  @BelongsTo(() => Role)
  sysRole: Role;
}

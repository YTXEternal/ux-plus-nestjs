import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  Comment,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Role } from './role.model';

@Table({
  tableName: 'user_role',
  timestamps: false,
  comment: '用户和角色关联表',
})
export class UserRole extends Model<UserRole> {
  @PrimaryKey
  @ForeignKey(() => User)
  @Comment('用户ID')
  @Column(DataType.BIGINT)
  user_id: number;

  @PrimaryKey
  @ForeignKey(() => Role)
  @Comment('角色ID')
  @Column(DataType.BIGINT)
  role_id: number;
}

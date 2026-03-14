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
import { Dept } from './dept.model';

@Table({
  tableName: 'user_dept',
  timestamps: false,
  comment: '用户和部门关联表',
})
export class UserDept extends Model<UserDept> {
  @PrimaryKey
  @ForeignKey(() => User)
  @Comment('用户ID')
  @Column(DataType.BIGINT)
  user_id: number;

  @PrimaryKey
  @ForeignKey(() => Dept)
  @Comment('部门ID')
  @Column(DataType.BIGINT)
  dept_id: number;
}

import { Column, Comment, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'chat_session',
  comment: '聊天会话表',
})
export class ChatSession extends Model<ChatSession> {
  @Comment('主键')
  @Column({
    type: DataType.STRING(64),
    primaryKey: true,
  })
  session_id: string;

  @Comment('用户ID')
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  user_id: number;

  @Comment('会话标题')
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title: string;

  @Comment('创建时间')
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  create_time: Date;

  @Comment('更新时间')
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  update_time: Date;

  @Comment('删除标志（0代表存在 2代表删除）')
  @Column({
    type: DataType.CHAR(1),
    defaultValue: '0',
  })
  del_flag: string;
}

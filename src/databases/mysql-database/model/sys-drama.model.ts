import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Comment,
  BelongsToMany,
} from 'sequelize-typescript';
import { Shop } from './shop.model';
import { Label } from './label.model';
import { SysDramaShop } from './sys-drama-shop.model';
import { SysDramaLabel } from './sys-drama-label.model';

@Table({
  tableName: 'sys_drama',
  timestamps: true,
  createdAt: 'create_time',
  updatedAt: 'update_time',
  comment: '剧本信息表',
})
export class SysDrama extends Model<SysDrama> {
  @PrimaryKey
  @AutoIncrement
  @Comment('剧本ID')
  @Column(DataType.BIGINT)
  event_id: number;

  @Comment('剧本名称')
  @Column({ type: DataType.STRING(30), allowNull: false, unique: true })
  name: string;

  @Comment('剧本描述')
  @Column({ type: DataType.STRING(500), defaultValue: null })
  desc: string;

  @Comment('有效开始时间')
  @Column(DataType.DATE)
  valid_start_time: Date;

  @Comment('有效结束时间')
  @Column(DataType.DATE)
  valid_end_time: Date;

  @Comment('删除标志（0代表存在 2代表删除）')
  @Column({ type: DataType.CHAR(1), defaultValue: '0' })
  del_flag: string;

  @Comment('状态（0启用 1停用）')
  @Column({ type: DataType.CHAR(1), defaultValue: '0' })
  status: string;

  @BelongsToMany(() => Shop, () => SysDramaShop)
  shops: Shop[];

  @BelongsToMany(() => Label, () => SysDramaLabel)
  labels: Label[];
}

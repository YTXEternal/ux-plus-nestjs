import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  Comment,
  ForeignKey,
} from 'sequelize-typescript';
import { SysDrama } from './sys-drama.model';
import { Label } from './label.model';

@Table({
  tableName: 'sys_drama_label',
  timestamps: false,
  comment: '剧本-标签关联表',
})
export class SysDramaLabel extends Model<SysDramaLabel> {
  @ForeignKey(() => SysDrama)
  @PrimaryKey
  @Comment('剧本ID')
  @Column(DataType.BIGINT)
  drama_id: number;

  @ForeignKey(() => Label)
  @PrimaryKey
  @Comment('标签ID')
  @Column(DataType.BIGINT)
  label_id: number;
}

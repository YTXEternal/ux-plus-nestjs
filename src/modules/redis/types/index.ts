import { FindOptions } from 'sequelize';
import { Model } from 'sequelize-typescript';

export type Where<M extends Model> = Pick<M, 'where'>;

export type UseFindParamsOpt = Partial<{
  /**
   * 锁定所选行。可选选项包括 transaction.LOCK.UPDATE 和 transaction.LOCK.SHARE。
   * Postgres 还支持 transaction.LOCK.KEY_SHARE、transaction.LOCK.NO_KEY_UPDATE 以及特定模型的连接锁。
   * 参见 [transaction.LOCK 示例](transaction#lock)
   */
  attrs: string[];
  //   default:true
  parse: boolean;
  expiretime: number;
}> & { key: string } & Omit<FindOptions, 'attrs'>;

export type SelectAllResponse<T> = T[];
export type SelectOneResponse<T> = T | null;

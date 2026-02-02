import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysOperLog } from '@/databases/mysql-database/model/sys-oper-log.model';
import { Op } from 'sequelize';

import { ListOperLogDto } from './dto/sys-oper-log.dto';

/**
 * 监控-操作日志服务
 *
 * 提供操作日志的分页查询、删除与清空等维护能力。
 *
 * @export
 * @class SysOperLogService
 * @typedef {SysOperLogService}
 */
@Injectable()
export class SysOperLogService {
  /**
   * 构造函数
   *
   * @param {typeof SysOperLog} sysOperLogModel 操作日志模型
   */
  constructor(
    @InjectModel(SysOperLog)
    private readonly sysOperLogModel: typeof SysOperLog,
  ) {}

  /**
   * 操作日志分页列表查询
   *
   * @async
   * @param {ListOperLogDto} query 查询参数
   * @returns {Promise<{ rows: SysOperLog[]; total: number }>} 分页结果
   */
  async findAll(query: ListOperLogDto) {
    const {
      pageNum = 1,
      pageSize = 20,
      title,
      oper_name,
      business_type,
      status,
    } = query;
    const where: any = {};
    if (title) where.title = { [Op.like]: `%${title}%` };
    if (oper_name) where.oper_name = { [Op.like]: `%${oper_name}%` };
    if (business_type) where.business_type = business_type;
    if (status) where.status = status;

    const { rows, count } = await this.sysOperLogModel.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: +pageSize,
      order: [['oper_time', 'DESC']],
    });

    return { rows, total: count };
  }

  /**
   * 删除操作日志
   *
   * @async
   * @param {string} operIds 操作日志ID列表（逗号分隔）
   * @returns {Promise<number>} 删除的记录数
   */
  async delete(operIds: string) {
    const ids = operIds.split(',');
    return this.sysOperLogModel.destroy({ where: { oper_id: ids } });
  }

  /**
   * 清空操作日志
   *
   * @async
   * @returns {Promise<number>} 删除的记录数
   */
  async clean() {
    return this.sysOperLogModel.destroy({ truncate: true });
  }
}

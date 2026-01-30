import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysOperLog } from '@/databases/mysql-database/model/sys-oper-log.model';
import { Op } from 'sequelize';

@Injectable()
export class SysOperLogService {
  constructor(
    @InjectModel(SysOperLog)
    private readonly sysOperLogModel: typeof SysOperLog,
  ) {}

  async findAll(query: any) {
    const { pageNum = 1, pageSize = 10, title, operName, status } = query;
    const where: any = {};
    if (title) where.title = { [Op.like]: `%${title}%` };
    if (operName) where.oper_name = { [Op.like]: `%${operName}%` };
    if (status) where.status = status;

    const { rows, count } = await this.sysOperLogModel.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: +pageSize,
      order: [['oper_time', 'DESC']],
    });
    return { rows, total: count };
  }

  async delete(operIds: string) {
    const ids = operIds.split(',');
    return this.sysOperLogModel.destroy({ where: { oper_id: ids } });
  }

  async clean() {
    return this.sysOperLogModel.destroy({ where: {}, truncate: true });
  }
}

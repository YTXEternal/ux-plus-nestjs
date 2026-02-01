import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysOperLog } from '@/databases/mysql-database/model/sys-oper-log.model';
import { Op } from 'sequelize';

import { ListOperLogDto } from './dto/sys-oper-log.dto';

@Injectable()
export class SysOperLogService {
  constructor(
    @InjectModel(SysOperLog)
    private readonly sysOperLogModel: typeof SysOperLog,
  ) {}

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

  async delete(operIds: string) {
    const ids = operIds.split(',');
    return this.sysOperLogModel.destroy({ where: { oper_id: ids } });
  }

  async clean() {
    return this.sysOperLogModel.destroy({ truncate: true });
  }
}

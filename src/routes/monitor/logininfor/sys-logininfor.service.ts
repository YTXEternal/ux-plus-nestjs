import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysLogininfor } from '@/databases/mysql-database/model/sys-logininfor.model';
import { Op } from 'sequelize';

@Injectable()
export class SysLogininforService {
  constructor(
    @InjectModel(SysLogininfor)
    private readonly sysLogininforModel: typeof SysLogininfor,
  ) {}

  async findAll(query: any) {
    const { pageNum = 1, pageSize = 10, ipaddr, userName, status } = query;
    const where: any = {};
    if (ipaddr) where.ipaddr = { [Op.like]: `%${ipaddr}%` };
    if (userName) where.user_name = { [Op.like]: `%${userName}%` };
    if (status) where.status = status;

    const { rows, count } = await this.sysLogininforModel.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: +pageSize,
      order: [['login_time', 'DESC']],
    });
    return { rows, total: count };
  }

  async delete(infoIds: string) {
    const ids = infoIds.split(',');
    return this.sysLogininforModel.destroy({ where: { info_id: ids } });
  }

  async clean() {
    return this.sysLogininforModel.destroy({ where: {}, truncate: true });
  }

  async unlock(userName: string) {
    // Implement unlock logic (e.g. clear failed login count in Redis)
    return { message: 'Unlocked successfully' };
  }
}

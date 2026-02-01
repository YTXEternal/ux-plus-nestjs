import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysLogininfor } from '@/databases/mysql-database/model/sys-logininfor.model';
import { RedisService } from '@/modules/redis/redis.service';
import { Op } from 'sequelize';

import { ListLogininforDto } from './dto/sys-logininfor.dto';

@Injectable()
export class SysLogininforService {
  constructor(
    @InjectModel(SysLogininfor)
    private readonly sysLogininforModel: typeof SysLogininfor,
    private readonly redisService: RedisService,
  ) {}

  async findAll(query: ListLogininforDto) {
    const { pageNum = 1, pageSize = 20, ipaddr, user_name, status } = query;
    const where: any = {};
    if (ipaddr) where.ipaddr = { [Op.like]: `%${ipaddr}%` };
    if (user_name) where.user_name = { [Op.like]: `%${user_name}%` };
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
    return this.sysLogininforModel.destroy({ truncate: true });
  }

  async unlock(user_name: string) {
    // TODO: implement unlock logic, maybe remove from redis block list
    return { user_name };
  }
}

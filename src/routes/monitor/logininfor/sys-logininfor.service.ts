import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logininfor } from '@/databases/mysql-database/model/logininfor.model';
import { RedisService } from '@/modules/redis/redis.service';
import { Op } from 'sequelize';

import { ListLogininforDto } from './dto/sys-logininfor.dto';

/**
 * 监控-登录日志服务
 *
 * 提供登录日志的分页查询、删除、清空与解锁相关操作能力。
 *
 * @export
 * @class SysLogininforService
 * @typedef {SysLogininforService}
 */
@Injectable()
export class SysLogininforService {
  /**
   * 构造函数
   *
   * @param {typeof Logininfor} sysLogininforModel 登录日志模型
   * @param {RedisService} redisService Redis 缓存服务（用于解锁等扩展能力）
   */
  constructor(
    @InjectModel(Logininfor)
    private readonly sysLogininforModel: typeof Logininfor,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 登录日志分页列表查询
   *
   * @async
   * @param {ListLogininforDto} query 查询参数
   * @returns {Promise<{ rows: Logininfor[]; total: number }>} 分页结果
   */
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

  /**
   * 删除登录日志
   *
   * @async
   * @param {string} infoIds 登录日志ID列表（逗号分隔）
   * @returns {Promise<number>} 删除的记录数
   */
  async delete(infoIds: string) {
    const ids = infoIds.split(',');
    return this.sysLogininforModel.destroy({ where: { info_id: ids } });
  }

  /**
   * 清空登录日志
   *
   * @async
   * @returns {Promise<number>} 删除的记录数
   */
  async clean() {
    return this.sysLogininforModel.destroy({ truncate: true });
  }

  /**
   * 解锁用户
   *
   * 当前为占位实现，可按业务需要补充（例如移除 Redis 中的锁定/黑名单信息）。
   *
   * @async
   * @param {string} user_name 用户名
   * @returns {Promise<{ user_name: string }>} 解锁结果
   */
  async unlock(user_name: string) {
    // TODO: implement unlock logic, maybe remove from redis block list
    return { user_name };
  }
}

import { Injectable } from '@nestjs/common';
import { RedisService } from '@/modules/redis/redis.service';
import { ConfigService } from '@nestjs/config';

import { ListOnlineDto } from './dto/sys-online.dto';

/**
 * 监控-在线用户服务
 *
 * 通过 Redis 中的登录 Token 数据，提供在线用户分页查询与强制下线等业务能力。
 *
 * @export
 * @class SysOnlineService
 * @typedef {SysOnlineService}
 */
@Injectable()
export class SysOnlineService {
  /**
   * 构造函数
   *
   * @param {RedisService} redisService Redis 缓存服务
   * @param {ConfigService} configService 配置服务
   */
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 在线用户分页列表查询
   *
   * 当 Redis 未启用时直接返回空列表。
   *
   * @async
   * @param {ListOnlineDto} query 查询参数
   * @returns {Promise<{ rows: any[]; total: number }>} 分页结果
   */
  async findAll(query: ListOnlineDto) {
    const { pageNum = 1, pageSize = 20, ipaddr, user_name } = query;
    const redisBootUp = this.configService.get('REDIS_BOOT_UP') === 'true';
    if (!redisBootUp) {
      return { rows: [], total: 0 };
    }

    let keys: string[] = [];
    try {
      keys = await this.redisService.redis.keys('login_tokens:*');
    } catch (e) {
      void e;
      return { rows: [], total: 0 };
    }
    const onlineUserList = [];
    for (const key of keys) {
      let user: any;
      try {
        user = await this.redisService.getCatche<any>(key);
      } catch (e) {
        void e;
        continue;
      }
      if (ipaddr && user.ipaddr.indexOf(ipaddr) === -1) {
        continue;
      }
      if (user_name && user.userName.indexOf(user_name) === -1) {
        continue;
      }

      // @ts-ignore
      onlineUserList.push(user);
    }
    // pagination
    const total = onlineUserList.length;
    const start = (pageNum - 1) * pageSize;
    const end = pageNum * pageSize;
    const rows = onlineUserList.slice(start, end);

    return { rows, total };
  }

  /**
   * 强制下线（删除指定 token 的缓存）
   *
   * 当 Redis 未启用或删除失败时返回 0。
   *
   * @async
   * @param {string} tokenId token 标识
   * @returns {Promise<number>} 删除结果
   */
  async forceLogout(tokenId: string) {
    const redisBootUp = this.configService.get('REDIS_BOOT_UP') === 'true';
    if (!redisBootUp) {
      return 0;
    }
    try {
      return await this.redisService.redis.del(`login_tokens:${tokenId}`);
    } catch (e) {
      void e;
      return 0;
    }
  }
}

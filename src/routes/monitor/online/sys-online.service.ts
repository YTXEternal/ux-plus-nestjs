import { Injectable } from '@nestjs/common';
import { RedisService } from '@/modules/redis/redis.service';
import { ConfigService } from '@nestjs/config';

import { ListOnlineDto } from './dto/sys-online.dto';

@Injectable()
export class SysOnlineService {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

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

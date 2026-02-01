import { Injectable } from '@nestjs/common';
import { RedisService } from '@/modules/redis/redis.service';

import { ListOnlineDto } from './dto/sys-online.dto';

@Injectable()
export class SysOnlineService {
  constructor(private readonly redisService: RedisService) {}

  async findAll(query: ListOnlineDto) {
    const { pageNum = 1, pageSize = 20, ipaddr, user_name } = query;
    const keys = await this.redisService.redis.keys('login_tokens:*');
    const onlineUserList = [];
    for (const key of keys) {
      const user = await this.redisService.getCatche<any>(key);
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
    return this.redisService.redis.del(`login_tokens:${tokenId}`);
  }
}

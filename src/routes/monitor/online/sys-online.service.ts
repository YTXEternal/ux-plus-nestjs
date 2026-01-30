import { Injectable } from '@nestjs/common';
import { RedisService } from '@/modules/redis/redis.service';

@Injectable()
export class SysOnlineService {
  constructor(private readonly redisService: RedisService) {}

  async findAll(query: any) {
    const { ipaddr, userName } = query;
    // Get all keys matching login tokens
    // Design says CacheConstants.LOGIN_TOKEN_KEY, assuming it's 'login_tokens:'
    const keys = await this.redisService.redis.keys('login_tokens:*');
    const onlineUsers: any[] = [];

    for (const key of keys) {
      const token = key.replace('login_tokens:', '');
      // Assuming we store user info in Redis value
      const user = await this.redisService.getCatche<any>(key);
      if (user) {
        try {
          if (ipaddr && !user.ipaddr.includes(ipaddr)) continue;

          if (userName && !user.userName.includes(userName)) continue;
          onlineUsers.push({
            tokenId: token,
            ...user,
          });
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
    }

    return { rows: onlineUsers, total: onlineUsers.length };
  }

  async forceLogout(tokenId: string) {
    return this.redisService.redis.del(`login_tokens:${tokenId}`);
  }
}

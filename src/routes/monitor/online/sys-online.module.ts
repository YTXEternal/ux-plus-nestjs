import { Module } from '@nestjs/common';
import { SysOnlineService } from './sys-online.service';
import { SysOnlineController } from './sys-online.controller';
import { RedisModule } from '@/modules/redis/redis.module';

/**
 * 监控-在线用户模块
 *
 * 提供在线用户的查询与强制下线等接口能力，并依赖 Redis 用于在线状态存储/查询。
 *
 * @export
 * @class SysOnlineModule
 * @typedef {SysOnlineModule}
 */
@Module({
  imports: [RedisModule],
  controllers: [SysOnlineController],
  providers: [SysOnlineService],
})
export class SysOnlineModule {}

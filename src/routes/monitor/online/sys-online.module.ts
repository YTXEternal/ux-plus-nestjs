import { Module } from '@nestjs/common';
import { SysOnlineService } from './sys-online.service';
import { SysOnlineController } from './sys-online.controller';
import { RedisModule } from '@/modules/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [SysOnlineController],
  providers: [SysOnlineService],
})
export class SysOnlineModule {}

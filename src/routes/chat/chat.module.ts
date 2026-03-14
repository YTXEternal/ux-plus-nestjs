import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { SysUserModule } from '@/routes/system/user/sys-user.module';
import { UxJwtModule } from '@/modules/ux-jwt/ux-jwt.module';
import { RedisModule } from '@/modules/redis/redis.module';
import { EnvConfigModule } from '@/modules/env-config/env-config.module';
import { ChatSession } from '@/databases/mysql-database/model/chat-session.model';
import {
  ChatMessage,
  ChatMessageSchema,
} from '@/databases/mongodb/schemas/chat-message.schema';

@Module({
  imports: [
    SysUserModule,
    UxJwtModule,
    RedisModule,
    EnvConfigModule,
    SequelizeModule.forFeature([ChatSession]),
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}

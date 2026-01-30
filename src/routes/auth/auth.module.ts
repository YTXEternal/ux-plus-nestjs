import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UxJwtModule } from '@/modules/ux-jwt/ux-jwt.module';
import { UxPasswordModule } from '@/modules/ux-password/ux-password.module';
import { UxCryptoRsaService } from '@/services/ux-crypto-rsa/ux-crypto-rsa.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysUser } from '@/databases/mysql-database/model/sys-user.model';
import { RedisModule } from '@/modules/redis/redis.module';

@Module({
  imports: [
    UxJwtModule,
    UxPasswordModule,
    SequelizeModule.forFeature([SysUser]),
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UxCryptoRsaService],
})
export class AuthModule {}

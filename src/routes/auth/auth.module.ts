import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UxJwtModule } from '@/modules/ux-jwt/ux-jwt.module';
import { UxPasswordModule } from '@/modules/ux-password/ux-password.module';
import { UxCryptoRsaService } from '@/services/ux-crypto-rsa/ux-crypto-rsa.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@/databases/mysql-database/model/user.model';
import { RedisModule } from '@/modules/redis/redis.module';
import { SysMenuModule } from '@/routes/system/menu/sys-menu.module';
import { SysUserService } from '@/routes/system/user/sys-user.service';
import { SysUserModule } from '@/routes/system/user/sys-user.module';

/**
 * 认证模块
 *
 * 提供登录相关接口的 Controller 与 Service，并装配鉴权所需的 JWT、密码加密与用户模型依赖。
 *
 * @export
 * @class AuthModule
 * @typedef {AuthModule}
 */
@Module({
  imports: [
    UxJwtModule,
    UxPasswordModule,
    SequelizeModule.forFeature([User]),
    RedisModule,
    SysMenuModule,
    SysUserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UxCryptoRsaService],
})
export class AuthModule {}

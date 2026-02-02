import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UxJwtService } from '@/modules/ux-jwt/ux-jwt.service';
import { RedisService } from '@/modules/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { SysUserService } from '@/routes/system/user/sys-user.service';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly uxJwtService: UxJwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly sysUserService: SysUserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const undisposedToken = request.headers['authorization'] as string;
    const message = 'Invalid or expired token.';
    const regex = /^Bearer\s/;
    const token = undisposedToken?.split(' ')?.[1];

    if (
      !undisposedToken ||
      typeof undisposedToken !== 'string' ||
      !regex.test(undisposedToken) ||
      !token
    )
      throw new UnauthorizedException(message);

    let deToken;
    try {
      deToken = this.uxJwtService.parseLoginToken(token);
    } catch (e) {
      throw new UnauthorizedException(message);
    }

    if (deToken.sub !== this.configService.get('JWT_LOGIN_TOKEN_SUBJECT'))
      throw new UnauthorizedException(message);

    // Check Redis for online user
    const tokenId = deToken.tokenId;
    const redisKey = `login_tokens:${tokenId}`;

    let user;
    const redisBootUp = this.configService.get('REDIS_BOOT_UP') === 'true';
    let shouldCheckDb = !redisBootUp;

    if (redisBootUp) {
      try {
        // getCatche returns parsed object or undefined
        user = await this.redisService.getCatche(redisKey);
      } catch (e) {
        // Redis service might be down, fallback to MySQL
        shouldCheckDb = true;
      }
    }

    if (shouldCheckDb) {
      const { data: dbUser } = await this.sysUserService.findOne(deToken.id);
      if (dbUser && dbUser.del_flag === '0' && dbUser.status === '0') {
        user = {
          user_id: dbUser.user_id,
          tokenId: tokenId,
          userName: dbUser.user_name,
          // Mock necessary fields
          ipaddr: request.ip || request.socket.remoteAddress,
          loginLocation: '',
          browser: '',
          os: '',
          loginTime: new Date(),
        };
      }
    }

    if (!user) {
      throw new UnauthorizedException('Token expired or user forced logout.');
    }

    // Attach user to request if needed
    request['user'] = user;

    return true;
  }
}

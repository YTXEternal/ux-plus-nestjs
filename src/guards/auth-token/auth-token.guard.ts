import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UxJwtService } from '@/modules/ux-jwt/ux-jwt.service';
import { RedisService } from '@/modules/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { SysUserService } from '@/routes/system/user/sys-user.service';
import { parseAuthToken } from '@/tools/parseAuthToken';
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

    const user = await parseAuthToken({
      undisposedToken,
      request,
      configService: this.configService,
      redisService: this.redisService,
      uxJwtService: this.uxJwtService,
      sysUserService: this.sysUserService,
    });

    if (!user) {
      return false;
    }
    request['user'] = user;
    return true;
  }
}

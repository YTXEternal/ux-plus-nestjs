import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UxJwtService } from '@/modules/ux-jwt/ux-jwt.service';
import { RedisService } from '@/modules/redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly uxJwtService: UxJwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
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
    // getCatche returns parsed object or undefined
    const user = await this.redisService.getCatche(redisKey);
    if (!user) {
      throw new UnauthorizedException('Token expired or user forced logout.');
    }

    // Attach user to request if needed
    request['user'] = user;

    return true;
  }
}

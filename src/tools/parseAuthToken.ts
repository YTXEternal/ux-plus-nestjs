import { RedisService } from '@/modules/redis/redis.service';
import { UxJwtService } from '@/modules/ux-jwt/ux-jwt.service';
import { SysUserService } from '@/routes/system/user/sys-user.service';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface User {
  user_id: number;
  tokenId: string;
  userName: string;
  ipaddr: string;
  loginLocation: string;
  browser: string;
  os: string;
  loginTime: Date;
}

export const parseAuthToken = async <T>({
  undisposedToken,
  request,
  configService,
  redisService,
  uxJwtService,
  sysUserService,
}: {
  undisposedToken: string;
  request: T;
  configService: ConfigService;
  redisService: RedisService;
  uxJwtService: UxJwtService;
  sysUserService: SysUserService;
}) => {
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
    deToken = uxJwtService.parseLoginToken(token);
  } catch (e) {
    throw new UnauthorizedException(message);
  }

  if (deToken.sub !== configService.get('JWT_LOGIN_TOKEN_SUBJECT'))
    throw new UnauthorizedException(message);

  // 检查 Redis 中的在线用户
  const tokenId = deToken.tokenId;
  const redisKey = `login_tokens:${tokenId}`;

  let user: User | undefined;
  const redisBootUp = configService.get('REDIS_BOOT_UP') === 'true';
  let shouldCheckDb = !redisBootUp;

  if (redisBootUp) {
    try {
      // getCatche 返回解析后的对象或 undefined
      user = await redisService.getCatche<User>(redisKey);
    } catch (e) {
      // Redis 服务可能宕机，回退到 MySQL
      shouldCheckDb = true;
    }
  }

  if (shouldCheckDb) {
    const { data: dbUser } = await sysUserService.findOne(deToken.id);
    if (dbUser && dbUser.del_flag === '0' && dbUser.status === '0') {
      user = {
        user_id: dbUser.user_id,
        tokenId: tokenId,
        userName: dbUser.user_name,
        // 模拟必要字段
        // @ts-ignore
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
  return user;
};

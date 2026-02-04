import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { parseAuthToken } from '../parseAuthToken';
import { RedisService } from '@/modules/redis/redis.service';
import { UxJwtService } from '@/modules/ux-jwt/ux-jwt.service';
import { SysUserService } from '@/routes/system/user/sys-user.service';

/**
 * parseAuthToken 工具函数的单元测试
 */
describe('parseAuthToken', () => {
  let configService: ConfigService;
  let redisService: RedisService;
  let uxJwtService: UxJwtService;
  let sysUserService: SysUserService;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockRedisService = {
    getCatche: jest.fn(),
  };

  const mockUxJwtService = {
    parseLoginToken: jest.fn(),
  };

  const mockSysUserService = {
    findOne: jest.fn(),
  };

  const mockRequest = {
    ip: '127.0.0.1',
    socket: { remoteAddress: '127.0.0.1' },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    configService = mockConfigService as any;
    redisService = mockRedisService as any;
    uxJwtService = mockUxJwtService as any;
    sysUserService = mockSysUserService as any;
  });

  const callParseAuthToken = async (token: string | undefined) => {
    return parseAuthToken({
      undisposedToken: token as any,
      request: mockRequest,
      configService,
      redisService,
      uxJwtService,
      sysUserService,
    });
  };

  /**
   * 测试：当 Token 缺失时应抛出 UnauthorizedException
   */
  it('should throw UnauthorizedException if token is missing', async () => {
    await expect(callParseAuthToken(undefined)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(callParseAuthToken('')).rejects.toThrow(UnauthorizedException);
  });

  /**
   * 测试：当 Token 格式无效时应抛出 UnauthorizedException
   */
  it('should throw UnauthorizedException if token format is invalid', async () => {
    await expect(callParseAuthToken('InvalidToken')).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(callParseAuthToken('Bearer')).rejects.toThrow(
      UnauthorizedException,
    ); // Split result is undefined for [1]
  });

  /**
   * 测试：当 JWT 解析失败时应抛出 UnauthorizedException
   */
  it('should throw UnauthorizedException if JWT parsing fails', async () => {
    const token = 'Bearer invalid.jwt.token';
    mockUxJwtService.parseLoginToken.mockImplementation(() => {
      throw new Error('Parse error');
    });

    await expect(callParseAuthToken(token)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  /**
   * 测试：当 Token 主题 (sub) 不匹配时应抛出 UnauthorizedException
   */
  it('should throw UnauthorizedException if token subject is invalid', async () => {
    const token = 'Bearer valid.jwt.token';
    mockUxJwtService.parseLoginToken.mockReturnValue({
      sub: 'wrong-subject',
    });
    mockConfigService.get.mockReturnValue('correct-subject');

    await expect(callParseAuthToken(token)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  /**
   * 测试：当 REDIS_BOOT_UP 为 true 且 Redis 中存在缓存时，应从 Redis 返回用户
   */
  it('should return user from Redis if REDIS_BOOT_UP is true', async () => {
    const token = 'Bearer valid.jwt.token';
    const decodedToken = {
      sub: 'correct-subject',
      tokenId: 'token-id',
      id: 1,
    };
    const mockUser = {
      user_id: 1,
      userName: 'test',
    };

    mockConfigService.get.mockImplementation((key) => {
      if (key === 'JWT_LOGIN_TOKEN_SUBJECT') return 'correct-subject';
      if (key === 'REDIS_BOOT_UP') return 'true';
      return null;
    });
    mockUxJwtService.parseLoginToken.mockReturnValue(decodedToken);
    mockRedisService.getCatche.mockResolvedValue(mockUser);

    const result = await callParseAuthToken(token);
    expect(result).toBe(mockUser);
    expect(mockRedisService.getCatche).toHaveBeenCalledWith(
      `login_tokens:${decodedToken.tokenId}`,
    );
    expect(mockSysUserService.findOne).not.toHaveBeenCalled();
  });

  /**
   * 测试：当 Redis 抛出错误时，应回退到数据库查询
   */
  it('should fallback to DB if Redis throws error', async () => {
    const token = 'Bearer valid.jwt.token';
    const decodedToken = {
      sub: 'correct-subject',
      tokenId: 'token-id',
      id: 1,
    };
    const dbUser = {
      user_id: 1,
      user_name: 'test',
      del_flag: '0',
      status: '0',
    };

    mockConfigService.get.mockImplementation((key) => {
      if (key === 'JWT_LOGIN_TOKEN_SUBJECT') return 'correct-subject';
      if (key === 'REDIS_BOOT_UP') return 'true';
      return null;
    });
    mockUxJwtService.parseLoginToken.mockReturnValue(decodedToken);
    mockRedisService.getCatche.mockRejectedValue(new Error('Redis down'));
    mockSysUserService.findOne.mockResolvedValue({ data: dbUser });

    const result = await callParseAuthToken(token);
    expect(result).toMatchObject({
      user_id: dbUser.user_id,
      userName: dbUser.user_name,
      tokenId: decodedToken.tokenId,
    });
    expect(mockSysUserService.findOne).toHaveBeenCalledWith(decodedToken.id);
  });

  /**
   * 测试：当 REDIS_BOOT_UP 为 false 时，应直接查询数据库
   */
  it('should check DB if REDIS_BOOT_UP is false', async () => {
    const token = 'Bearer valid.jwt.token';
    const decodedToken = {
      sub: 'correct-subject',
      tokenId: 'token-id',
      id: 1,
    };
    const dbUser = {
      user_id: 1,
      user_name: 'test',
      del_flag: '0',
      status: '0',
    };

    mockConfigService.get.mockImplementation((key) => {
      if (key === 'JWT_LOGIN_TOKEN_SUBJECT') return 'correct-subject';
      if (key === 'REDIS_BOOT_UP') return 'false';
      return null;
    });
    mockUxJwtService.parseLoginToken.mockReturnValue(decodedToken);
    mockSysUserService.findOne.mockResolvedValue({ data: dbUser });

    const result = await callParseAuthToken(token);
    expect(result).toMatchObject({
      user_id: dbUser.user_id,
      userName: dbUser.user_name,
      tokenId: decodedToken.tokenId,
    });
    expect(mockRedisService.getCatche).not.toHaveBeenCalled();
  });

  /**
   * 测试：当数据库中未找到用户时应抛出 UnauthorizedException
   */
  it('should throw UnauthorizedException if user not found in DB', async () => {
    const token = 'Bearer valid.jwt.token';
    const decodedToken = {
      sub: 'correct-subject',
      tokenId: 'token-id',
      id: 1,
    };

    mockConfigService.get.mockImplementation((key) => {
      if (key === 'JWT_LOGIN_TOKEN_SUBJECT') return 'correct-subject';
      if (key === 'REDIS_BOOT_UP') return 'false';
      return null;
    });
    mockUxJwtService.parseLoginToken.mockReturnValue(decodedToken);
    mockSysUserService.findOne.mockResolvedValue({ data: null });

    await expect(callParseAuthToken(token)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  /**
   * 测试：当数据库中用户被删除或状态无效时应抛出 UnauthorizedException
   */
  it('should throw UnauthorizedException if user in DB is deleted or invalid status', async () => {
    const token = 'Bearer valid.jwt.token';
    const decodedToken = {
      sub: 'correct-subject',
      tokenId: 'token-id',
      id: 1,
    };

    mockConfigService.get.mockImplementation((key) => {
      if (key === 'JWT_LOGIN_TOKEN_SUBJECT') return 'correct-subject';
      if (key === 'REDIS_BOOT_UP') return 'false';
      return null;
    });
    mockUxJwtService.parseLoginToken.mockReturnValue(decodedToken);

    // Case 1: del_flag !== '0'
    mockSysUserService.findOne.mockResolvedValue({
      data: { user_id: 1, del_flag: '1', status: '0' },
    });
    await expect(callParseAuthToken(token)).rejects.toThrow(
      UnauthorizedException,
    );

    // Case 2: status !== '0'
    mockSysUserService.findOne.mockResolvedValue({
      data: { user_id: 1, del_flag: '0', status: '1' },
    });
    await expect(callParseAuthToken(token)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

import { UnauthorizedException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { AuthTokenGuard } from './auth-token.guard';

type Mocked<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? jest.Mock : T[K];
};

const createExecutionContext = (request: Partial<Request>): ExecutionContext =>
  ({
    getHandler: () => () => void 0,
    getClass: () => class TestController {},
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  }) as unknown as ExecutionContext;

describe('AuthTokenGuard', () => {
  const jwtSubject = 'nestjs-token';

  let uxJwtService: Mocked<{
    parseLoginToken: (token: string) => any;
  }>;
  let redisService: Mocked<{
    getCatche: (key: string) => Promise<any>;
  }>;
  let configService: Mocked<{
    get: (key: string) => any;
  }>;
  let reflector: Mocked<{
    getAllAndOverride: (...args: any[]) => any;
  }>;
  let sysUserService: Mocked<{
    findOne: (id: number) => Promise<{ data: any }>;
  }>;

  const buildGuard = () =>
    new AuthTokenGuard(
      uxJwtService as any,
      redisService as any,
      configService as any,
      reflector as any,
      sysUserService as any,
    );

  beforeEach(() => {
    uxJwtService = {
      parseLoginToken: jest.fn(),
    };
    redisService = {
      getCatche: jest.fn(),
    };
    configService = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_LOGIN_TOKEN_SUBJECT') return jwtSubject;
        if (key === 'REDIS_BOOT_UP') return 'false';
        return undefined;
      }),
    };
    reflector = {
      getAllAndOverride: jest.fn(() => false),
    };
    sysUserService = {
      findOne: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('public', () => {
    it('should allow access when route is public', async () => {
      reflector.getAllAndOverride.mockReturnValue(true);
      const guard = buildGuard();
      const result = await guard.canActivate(createExecutionContext({} as any));
      expect(result).toBe(true);
    });
  });

  describe('authorization header', () => {
    it('should throw when authorization header is missing', async () => {
      const guard = buildGuard();
      const context = createExecutionContext({
        headers: {},
      } as any);
      await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('should throw when authorization is not Bearer', async () => {
      const guard = buildGuard();
      const context = createExecutionContext({
        headers: { authorization: 'Token abc' },
      } as any);
      await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('should throw when bearer token is empty', async () => {
      const guard = buildGuard();
      const context = createExecutionContext({
        headers: { authorization: 'Bearer ' },
      } as any);
      await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });

  describe('token parsing & subject', () => {
    it('should throw when parseLoginToken throws', async () => {
      uxJwtService.parseLoginToken.mockImplementation(() => {
        throw new Error('bad token');
      });
      const guard = buildGuard();
      const context = createExecutionContext({
        headers: { authorization: 'Bearer t' },
      } as any);
      await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('should throw when token subject mismatches', async () => {
      uxJwtService.parseLoginToken.mockReturnValue({
        id: 1,
        tokenId: 'tid',
        sub: 'wrong',
      });
      const guard = buildGuard();
      const context = createExecutionContext({
        headers: { authorization: 'Bearer t' },
      } as any);
      await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });

  describe('redis lookup', () => {
    it('should attach user from redis when redis is enabled and hit cache', async () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'JWT_LOGIN_TOKEN_SUBJECT') return jwtSubject;
        if (key === 'REDIS_BOOT_UP') return 'true';
        return undefined;
      });

      uxJwtService.parseLoginToken.mockReturnValue({
        id: 1,
        tokenId: 'token-id',
        sub: jwtSubject,
      });
      redisService.getCatche.mockResolvedValue({
        user_id: 1,
        tokenId: 'token-id',
        userName: 'u',
      });

      const request: any = {
        headers: { authorization: 'Bearer t' },
        ip: '127.0.0.1',
        socket: { remoteAddress: '127.0.0.2' },
      };
      const guard = buildGuard();
      const ok = await guard.canActivate(createExecutionContext(request));

      expect(ok).toBe(true);
      expect(redisService.getCatche).toHaveBeenCalledWith(
        'login_tokens:token-id',
      );
      expect(sysUserService.findOne).not.toHaveBeenCalled();
      expect(request.user).toMatchObject({
        user_id: 1,
        tokenId: 'token-id',
      });
    });

    it('should fallback to db when redis enabled but redis throws', async () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'JWT_LOGIN_TOKEN_SUBJECT') return jwtSubject;
        if (key === 'REDIS_BOOT_UP') return 'true';
        return undefined;
      });

      uxJwtService.parseLoginToken.mockReturnValue({
        id: 2,
        tokenId: 'token-id',
        sub: jwtSubject,
      });
      redisService.getCatche.mockRejectedValue(new Error('redis down'));
      sysUserService.findOne.mockResolvedValue({
        data: { user_id: 2, user_name: 'db', del_flag: '0', status: '0' },
      });

      const request: any = {
        headers: { authorization: 'Bearer t' },
        ip: '127.0.0.1',
        socket: { remoteAddress: '127.0.0.2' },
      };
      const guard = buildGuard();
      const ok = await guard.canActivate(createExecutionContext(request));

      expect(ok).toBe(true);
      expect(sysUserService.findOne).toHaveBeenCalledWith(2);
      expect(request.user).toMatchObject({
        user_id: 2,
        tokenId: 'token-id',
        userName: 'db',
      });
    });
  });

  describe('db fallback', () => {
    it('should load user from db when redis is disabled', async () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'JWT_LOGIN_TOKEN_SUBJECT') return jwtSubject;
        if (key === 'REDIS_BOOT_UP') return 'false';
        return undefined;
      });

      uxJwtService.parseLoginToken.mockReturnValue({
        id: 3,
        tokenId: 'token-id',
        sub: jwtSubject,
      });
      sysUserService.findOne.mockResolvedValue({
        data: { user_id: 3, user_name: 'db', del_flag: '0', status: '0' },
      });

      const request: any = {
        headers: { authorization: 'Bearer t' },
        ip: '127.0.0.1',
        socket: { remoteAddress: '127.0.0.2' },
      };
      const guard = buildGuard();
      const ok = await guard.canActivate(createExecutionContext(request));

      expect(ok).toBe(true);
      expect(request.user).toMatchObject({
        user_id: 3,
        tokenId: 'token-id',
      });
    });

    it('should throw when db user is invalid or missing', async () => {
      uxJwtService.parseLoginToken.mockReturnValue({
        id: 4,
        tokenId: 'token-id',
        sub: jwtSubject,
      });
      sysUserService.findOne.mockResolvedValue({
        data: { user_id: 4, user_name: 'db', del_flag: '2', status: '0' },
      });

      const guard = buildGuard();
      const context = createExecutionContext({
        headers: { authorization: 'Bearer t' },
        ip: '127.0.0.1',
        socket: { remoteAddress: '127.0.0.2' },
      } as any);

      await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });
});

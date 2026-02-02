import { ForbiddenException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';
import { PermissionsGuard } from './permissions.guard';

type Mocked<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? jest.Mock : T[K];
};

const createExecutionContext = (
  request: Record<string, unknown>,
): ExecutionContext =>
  ({
    getHandler: () => () => void 0,
    getClass: () => class TestController {},
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  }) as unknown as ExecutionContext;

describe('PermissionsGuard', () => {
  let reflector: Mocked<{
    getAllAndOverride: (...args: any[]) => any;
  }>;
  let sysPermissionService: Mocked<{
    getMenuPermission: (user: any) => Promise<Set<string>>;
  }>;

  const buildGuard = () =>
    new PermissionsGuard(reflector as any, sysPermissionService as any);

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(() => undefined),
    };
    sysPermissionService = {
      getMenuPermission: jest.fn(async () => new Set()),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should allow public route', async () => {
    reflector.getAllAndOverride.mockImplementation((key: string) => {
      if (key === IS_PUBLIC_KEY) return true;
      return undefined;
    });
    const guard = buildGuard();
    const ok = await guard.canActivate(createExecutionContext({}));
    expect(ok).toBe(true);
  });

  it('should allow when no permission metadata is defined', async () => {
    reflector.getAllAndOverride.mockImplementation((key: string) => {
      if (key === IS_PUBLIC_KEY) return false;
      if (key === PERMISSIONS_KEY) return undefined;
      return undefined;
    });
    const guard = buildGuard();
    const ok = await guard.canActivate(createExecutionContext({ user: {} }));
    expect(ok).toBe(true);
  });

  it('should throw when user is missing', async () => {
    reflector.getAllAndOverride.mockImplementation((key: string) => {
      if (key === IS_PUBLIC_KEY) return false;
      if (key === PERMISSIONS_KEY) return 'a:b:c';
      return undefined;
    });
    const guard = buildGuard();
    await expect(
      guard.canActivate(createExecutionContext({})),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('should allow when user is SUPERADMIN (*:*:*)', async () => {
    reflector.getAllAndOverride.mockImplementation((key: string) => {
      if (key === IS_PUBLIC_KEY) return false;
      if (key === PERMISSIONS_KEY) return 'a:b:c';
      return undefined;
    });
    sysPermissionService.getMenuPermission.mockResolvedValue(
      new Set(['*:*:*']),
    );
    const guard = buildGuard();
    const ok = await guard.canActivate(
      createExecutionContext({ user: { user_id: 1 } }),
    );
    expect(ok).toBe(true);
  });

  it('should allow when permission is included', async () => {
    reflector.getAllAndOverride.mockImplementation((key: string) => {
      if (key === IS_PUBLIC_KEY) return false;
      if (key === PERMISSIONS_KEY) return 'a:b:c';
      return undefined;
    });
    sysPermissionService.getMenuPermission.mockResolvedValue(
      new Set(['a:b:c']),
    );
    const guard = buildGuard();
    const ok = await guard.canActivate(
      createExecutionContext({ user: { user_id: 1 } }),
    );
    expect(ok).toBe(true);
  });

  it('should throw when permission is not included', async () => {
    reflector.getAllAndOverride.mockImplementation((key: string) => {
      if (key === IS_PUBLIC_KEY) return false;
      if (key === PERMISSIONS_KEY) return 'a:b:c';
      return undefined;
    });
    sysPermissionService.getMenuPermission.mockResolvedValue(
      new Set(['x:y:z']),
    );
    const guard = buildGuard();
    await expect(
      guard.canActivate(createExecutionContext({ user: { user_id: 1 } })),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});

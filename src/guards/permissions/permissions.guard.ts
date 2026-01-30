import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { SysPermissionService } from '@/modules/permission/sys-permission.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sysPermissionService: SysPermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. 如果是 Public，直接放行
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // 2. 获取接口需要的权限
    const requiredPermission = this.reflector.getAllAndOverride<string>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 如果接口没有定义权限要求，也放行 (根据需求，可以改为默认拒绝)
    // 这里我们假设如果没有 @RequirePermissions，只要通过了 AuthTokenGuard 就可以访问
    if (!requiredPermission) {
      return true;
    }

    // 3. 获取用户信息
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 如果没有用户信息（虽然 AuthTokenGuard 应该拦截了，但双重保险）
    if (!user) {
      throw new ForbiddenException('User not authenticated.');
    }

    // 4. 获取用户菜单权限
    const perms = await this.sysPermissionService.getMenuPermission(user);

    // 5. 校验权限
    // 超级管理员拥有 *:*:*
    if (perms.has('*:*:*')) {
      return true;
    }

    // 检查是否包含所需权限
    if (perms.has(requiredPermission)) {
      return true;
    }

    throw new ForbiddenException(
      `Permission denied. Required: ${requiredPermission}`,
    );
  }
}

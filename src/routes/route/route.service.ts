import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SysUserService } from '@/routes/system/user/sys-user.service';
import { SysMenuService } from '@/routes/system/menu/sys-menu.service';

@Injectable()
export class RouteService {
  constructor(
    private readonly sysUserService: SysUserService,
    private readonly sysMenuService: SysMenuService,
  ) {}

  /**
   * 获取路由信息
   * @param userId 用户ID
   * @returns 路由树
   */
  async getRouters(userId: number) {
    const { data: user } = await this.sysUserService.findOne(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const roleIds = user?.roles?.map((r) => r.role_id) || [];
    // 超级管理员直接获取所有数据，无需检查关联
    const isAdmin = user?.roles?.some((r) => r.role_key === 'SUPERADMIN');

    const menus = await this.sysMenuService.selectMenuTreeByRoleIds(
      roleIds,
      isAdmin,
    );
    return menus;
  }

  /**
   * 获取用户路由名称列表
   * @param userId 用户ID
   * @returns 路由名称列表对象
   */
  async getUserRoutes(userId: number) {
    const { data: user } = await this.sysUserService.findOne(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const roleIds = user?.roles?.map((r) => r.role_id) || [];
    const isAdmin = user?.roles?.some((r) => r.role_key === 'SUPERADMIN');

    const routes = await this.sysMenuService.selectMenuRouteNamesByRoleIds(
      roleIds,
      isAdmin,
    );

    return {
      home: 'dashboard',
      routes,
    };
  }

  /**
   * 检查路由是否存在
   * @param routeName 路由名称
   * @returns boolean
   */
  async isRouteExist(routeName: string) {
    return this.sysMenuService.checkRouteNameUnique(routeName);
  }
}

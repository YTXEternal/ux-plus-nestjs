/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysRole } from '@/databases/mysql-database/model/sys-role.model';
import { SysMenu } from '@/databases/mysql-database/model/sys-menu.model';
import { SysUser } from '@/databases/mysql-database/model/sys-user.model';

/**
 * 系统-权限服务
 *
 * 提供用户角色与菜单权限的计算与查询能力，供 Guard 等鉴权逻辑调用。
 *
 * @export
 * @class SysPermissionService
 * @typedef {SysPermissionService}
 */
@Injectable()
export class SysPermissionService {
  /**
   * 构造函数
   *
   * @param {typeof SysRole} roleModel 角色模型
   * @param {typeof SysMenu} menuModel 菜单模型
   * @param {typeof SysUser} userModel 用户模型
   */
  constructor(
    @InjectModel(SysRole) private readonly roleModel: typeof SysRole,
    @InjectModel(SysMenu) private readonly menuModel: typeof SysMenu,
    @InjectModel(SysUser) private readonly userModel: typeof SysUser,
  ) {}

  /**
   * 获取用户角色权限
   *
   * @async
   * @param {(SysUser | any)} user 用户信息（至少包含 user_id / isAdmin）
   * @returns {Promise<Set<string>>} 角色集合（role_key）
   */
  async getRolePermission(user: SysUser | any): Promise<Set<string>> {
    const roles = new Set<string>();
    // 查询用户角色
    // 注意：这里我们重新查询数据库以确保数据的实时性
    const userWithRoles = await this.userModel.findOne({
      where: { user_id: user.user_id },
      include: [
        {
          model: SysRole,
          attributes: ['role_key'],
        },
      ],
    });

    if (userWithRoles && userWithRoles.roles) {
      userWithRoles.roles.forEach((role) => {
        roles.add(role.role_key);
      });
    }
    return roles;
  }

  /**
   * 获取用户菜单权限
   *
   * @async
   * @param {(SysUser | any)} user 用户信息（至少包含 user_id / isAdmin）
   * @returns {Promise<Set<string>>} 权限标识集合（perms）
   */
  async getMenuPermission(user: SysUser | any): Promise<Set<string>> {
    const perms = new Set<string>();

    // 获取角色
    const roles = await this.getRolePermission(user);

    // 超级管理员权限
    if (roles.has('SUPERADMIN')) {
      perms.add('*:*:*');
    } else {
      // 查询角色对应的菜单权限
      const roleKeys = Array.from(roles);
      if (roleKeys.length > 0) {
        const rolesWithMenus = await this.roleModel.findAll({
          where: { role_key: roleKeys },
          include: [
            {
              model: SysMenu,
              attributes: ['perms'],
            },
          ],
        });

        rolesWithMenus.forEach((role) => {
          if (role.menus) {
            role.menus.forEach((menu) => {
              if (menu.perms) {
                perms.add(menu.perms);
              }
            });
          }
        });
      }
    }
    return perms;
  }
}

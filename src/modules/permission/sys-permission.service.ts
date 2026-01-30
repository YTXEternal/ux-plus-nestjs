/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysRole } from '@/databases/mysql-database/model/sys-role.model';
import { SysMenu } from '@/databases/mysql-database/model/sys-menu.model';
import { SysUser } from '@/databases/mysql-database/model/sys-user.model';

@Injectable()
export class SysPermissionService {
  constructor(
    @InjectModel(SysRole) private readonly roleModel: typeof SysRole,
    @InjectModel(SysMenu) private readonly menuModel: typeof SysMenu,
    @InjectModel(SysUser) private readonly userModel: typeof SysUser,
  ) {}

  /**
   * 获取用户角色权限
   */
  async getRolePermission(user: SysUser | any): Promise<Set<string>> {
    const roles = new Set<string>();
    // 管理员拥有所有权限
    if (user && user.isAdmin) {
      roles.add('admin');
    } else {
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
    }
    return roles;
  }

  /**
   * 获取用户菜单权限
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

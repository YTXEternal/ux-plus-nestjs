import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Menu } from '@/databases/mysql-database/model/menu.model';
import { RoleMenu } from '@/databases/mysql-database/model/role-menu.model';
import { Op } from 'sequelize';
import { ListMenuDto, CreateMenuDto, UpdateMenuDto } from './dto/sys-menu.dto';
import type { SysMenuTree } from './types';
import { SysMenuInter } from '@/databases/mysql-database/interfaces/sys-menu.interface';
import { filterObj, isNull, isUndefined } from '@/tools';
// export type SysMenuTree = Menu & { children?: SysMenuTree[] };

/**
 * 系统-菜单服务
 *
 * 提供菜单管理相关业务能力（查询列表、详情、创建、更新、删除，并维护菜单与角色的关联数据）。
 *
 * @export
 * @class SysMenuService
 * @typedef {SysMenuService}
 */
@Injectable()
export class SysMenuService {
  /**
   * 构造函数
   *
   * @param {typeof Menu} sysMenuModel 菜单模型
   * @param {typeof RoleMenu} sysRoleMenuModel 角色-菜单关联模型
   */
  constructor(
    @InjectModel(Menu)
    private readonly sysMenuModel: typeof Menu,
    @InjectModel(RoleMenu)
    private readonly sysRoleMenuModel: typeof RoleMenu,
  ) {}

  /**
   * 查询菜单列表
   *
   * @async
   * @param {ListMenuDto} query 查询参数
   * @returns {Promise<Menu[]>} 菜单列表
   */
  async findAll(query: ListMenuDto) {
    const { menu_name, status } = query;
    const where: any = { status: '0' };
    if (menu_name) where.menu_name = { [Op.like]: `%${menu_name}%` };
    if (status) where.status = status;

    const menus = await this.sysMenuModel.findAll({
      where,
      order: [['order_num', 'ASC']],
    });

    return this.buildMenuTree(menus);
  }

  /**
   * 获取菜单详情
   *
   * @async
   * @param {number} menuId 菜单ID
   * @returns {Promise<Menu | null>} 菜单记录
   */
  async findOne(menuId: number) {
    return this.sysMenuModel.findByPk(menuId);
  }

  /**
   * 创建菜单
   *
   * @async
   * @param {CreateMenuDto} createMenuDto 创建参数
   * @returns {Promise<Menu>} 创建后的菜单记录
   */
  async create(createMenuDto: CreateMenuDto) {
    // @ts-ignore
    return this.sysMenuModel.create(createMenuDto);
  }

  /**
   * 更新菜单
   *
   * @async
   * @param {UpdateMenuDto} updateMenuDto 更新参数
   * @returns {Promise<[number, Menu[]]>} Sequelize 更新结果
   */
  async update(updateMenuDto: UpdateMenuDto) {
    const { menu_id, ...data } = updateMenuDto;
    // 更新需要把空值过滤
    // const pureData = filterObj(data,(_,el)=>!isNull(el) ||!isUndefined(el));
    return this.sysMenuModel.update(data, { where: { menu_id } });
  }

  /**
   * 删除菜单
   *
   * 删除前会检查是否存在子菜单，存在则抛出错误。
   *
   * @async
   * @param {number} menuId 菜单ID
   * @returns {Promise<number>} 删除的记录数
   */
  async delete(menuId: number) {
    // Check if has children
    const count = await this.sysMenuModel.count({
      where: { parent_id: menuId },
    });
    if (count > 0) throw new Error('Exist child menu, can not delete');
    return this.sysMenuModel.destroy({ where: { menu_id: menuId } });
  }

  /**
   * 根据角色ID列表查询菜单树
   *
   * @async
   * @param {number[]} roleIds 角色ID列表
   * @param {boolean} isAdmin 是否是管理员
   * @returns {Promise<SysMenuTree[]>} 菜单树
   */
  async selectMenuTreeByRoleIds(
    roleIds: number[],
    isAdmin: boolean = false,
  ): Promise<SysMenuTree[]> {
    let menus: Menu[] = [];
    const menu_type = ['M', 'C'];
    if (isAdmin) {
      menus = await this.sysMenuModel.findAll({
        where: { status: '0', menu_type },
        order: [['order_num', 'ASC']],
      });
    } else {
      if (roleIds.length === 0) return [];

      // 通过角色-菜单关联表查询
      // 这里需要关联查询，或者先查关联表再查菜单表
      // 使用 Sequelize include
      menus = await this.sysMenuModel.findAll({
        include: [
          {
            model: RoleMenu,
            where: { role_id: roleIds },
            attributes: [], // 不返回关联表数据
          },
        ],
        where: { status: '0', menu_type: menu_type },
        order: [['order_num', 'ASC']],
      });
    }

    return this.buildMenuTree(menus);
  }

  /**
   * 构建菜单树
   *
   * @param {Menu[]} menus 菜单列表
   * @returns {SysMenuTree[]} 树形结构
   */
  buildMenuTree(menus: Menu[]): SysMenuTree[] {
    const menuMap = new Map<number, SysMenuTree>();
    const tree: SysMenuTree[] = [];

    // 1. 初始化 Map
    menus.forEach((menu) => {
      menuMap.set(menu.menu_id, {
        ...menu.toJSON(),
        children: [],
      } as unknown as SysMenuTree);
    });

    // 2. 构建树
    menus.forEach((menu) => {
      const node = menuMap.get(menu.menu_id);
      if (node) {
        if (menu.parent_id === 0) {
          tree.push(node);
        } else {
          const parent = menuMap.get(menu.parent_id);
          if (parent) {
            if (!parent.children) parent.children = [];
            parent.children.push(node);
          } else {
            // 如果找不到父节点，可能父节点被禁用或未选中，视情况处理
            // 这里暂时作为根节点或者忽略
            // tree.push(node);
          }
        }
      }
    });

    return tree;
  }

  /**
   * 获取所有权限标识
   *
   * @param roleIds
   * @param isAdmin
   */
  async selectPermsByRoleIds(roleIds: number[], isAdmin: boolean = false) {
    let menus: Menu[] = [];
    if (isAdmin) {
      menus = await this.sysMenuModel.findAll({
        where: { status: '0' },
      });
    } else {
      if (roleIds.length === 0) return [];
      menus = await this.sysMenuModel.findAll({
        include: [
          {
            model: RoleMenu,
            where: { role_id: roleIds },
            attributes: [],
          },
        ],
        where: { status: '0' },
      });
    }

    const perms = new Set<string>();
    menus.forEach((menu) => {
      if (menu.perms) {
        menu.perms.split(',').forEach((p) => perms.add(p.trim()));
      }
    });
    return Array.from(perms);
  }

  /**
   * 根据角色ID列表查询路由名称列表
   *
   * @async
   * @param {number[]} roleIds 角色ID列表
   * @param {boolean} isAdmin 是否是管理员
   * @returns {Promise<string[]>} 路由名称列表
   */
  async selectMenuRouteNamesByRoleIds(
    roleIds: number[],
    isAdmin: boolean = false,
  ): Promise<string[]> {
    let menus: Menu[] = [];
    const menu_type = ['M', 'C'];
    const attributes = ['route_name'];

    if (isAdmin) {
      menus = await this.sysMenuModel.findAll({
        attributes,
        where: { status: '0', menu_type },
      });
    } else {
      if (roleIds.length === 0) return [];
      menus = await this.sysMenuModel.findAll({
        attributes,
        include: [
          {
            model: RoleMenu,
            where: { role_id: roleIds },
            attributes: [],
          },
        ],
        where: { status: '0', menu_type },
      });
    }

    const routeNames = new Set<string>();
    menus.forEach((menu) => {
      if (menu.route_name) {
        routeNames.add(menu.route_name);
      }
    });
    return Array.from(routeNames);
  }

  /**
   * 检查路由名称是否存在
   *
   * @async
   * @param {string} routeName 路由名称
   * @returns {Promise<boolean>} 是否存在
   */
  async checkRouteNameUnique(routeName: string): Promise<boolean> {
    const count = await this.sysMenuModel.count({
      where: { route_name: routeName },
    });
    return count > 0;
  }

  async formatToTree<T extends SysMenuInter>(menu: T[]) {
    function convertToTree(regions: SysMenuTree[], rootId = 0) {
      return regions
        .filter((v) => v.parent_id === rootId)
        .map((v) => {
          v.children = convertToTree(regions, v.menu_id);
          return v;
        });
    }
    return convertToTree(menu);
  }
}

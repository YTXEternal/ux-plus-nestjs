import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '@/databases/mysql-database/model/role.model';
import { SysRoleInter } from '@/databases/mysql-database/interfaces/sys-role.interface';
import { RoleMenu } from '@/databases/mysql-database/model/role-menu.model';
import { Op, where } from 'sequelize';

import {
  ListRoleDto,
  CreateRoleDto,
  UpdateRoleDto,
  ChangeRoleStatusDto,
} from './dto/sys-role.dto';
import { filterObj, isNull, isUndefined } from '@/tools';
import { ConfigService } from '@nestjs/config';

/**
 * 系统-角色服务
 *
 * 提供角色管理相关业务能力（分页查询、详情、创建、更新、逻辑删除、状态变更，并维护角色与菜单/部门的关联关系）。
 *
 * @export
 * @class SysRoleService
 * @typedef {SysRoleService}
 */
@Injectable()
export class SysRoleService {
  /**
   * 构造函数
   *
   * @param {typeof Role} sysRoleModel 角色模型
   * @param {typeof RoleMenu} sysRoleMenuModel 角色-菜单关联模型
   */
  constructor(
    @InjectModel(Role)
    private readonly sysRoleModel: typeof Role,
    @InjectModel(RoleMenu)
    private readonly sysRoleMenuModel: typeof RoleMenu,
    private readonly configService: ConfigService,
  ) {}
  /**
   * 角色分页列表查询
   *
   * @async
   * @param {ListRoleDto} query 查询参数
   * @returns {Promise<{ rows: Role[]; total: number }>} 分页结果
   */
  async findAll(query: ListRoleDto) {
    const { pageNum = 1, pageSize = 20, role_name, role_key, status } = query;
    // 帮我写一个 条件就是role_key 不等于SUPERADMIN
    const where: any = {
      del_flag: '0',
      // role_key: { [Op.ne]: this.configService.get('SUPERADMIN_ROLE_KEY') },
    };
    if (role_name) where.role_name = { [Op.like]: `%${role_name}%` };
    if (role_key)
      where.role_key = {
        [Op.like]: `%${role_key}%`,
        // [Op.ne]: this.configService.get('SUPERADMIN_ROLE_KEY'),
      };
    if (status) where.status = status;
    console.log('where', where);
    const { rows, count } = await this.sysRoleModel.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: +pageSize,
      order: [['create_time', 'DESC']],
    });

    return { rows, total: count };
  }

  /**
   * 获取所有角色列表（不分页）
   *
   * @async
   * @param {ListRoleDto} query 查询参数
   * @returns {Promise<Role[]>} 角色列表
   */
  async findFullData(query: ListRoleDto) {
    const { role_name, role_key, status } = query;
    const where: any = {
      del_flag: '0',
      // role_key: { [Op.ne]: this.configService.get('SUPERADMIN_ROLE_KEY') },
    };
    if (role_name) where.role_name = { [Op.like]: `%${role_name}%` };
    if (role_key)
      where.role_key = {
        [Op.like]: `%${role_key}%`,
        // [Op.ne]: this.configService.get('SUPERADMIN_ROLE_KEY'),
      };
    if (status) where.status = status;

    return this.sysRoleModel.findAll({
      where,
      order: [['create_time', 'DESC']],
    });
  }

  /**
   * 获取角色详情
   *
   * @async
   * @param {number} roleId 角色ID
   * @returns {Promise<Role | null>} 角色记录
   */
  async findOne(roleId: number) {
    const roleDetail = await this.sysRoleModel.findOne<Role>({
      where: { role_id: roleId },
    });
    if (!roleDetail) return null;
    const { role_id } = roleDetail;
    const menuRow = await this.sysRoleMenuModel.findAll<RoleMenu>({
      where: {
        role_id,
      },
    });
    const menu_ids = menuRow.map((v) => v.menu_id);
    return { ...roleDetail.dataValues, menu_ids };
  }
  /**
   * 创建角色
   *
   * 如传入 menu_ids，会创建角色与菜单的关联关系。
   *
   * @async
   * @param {CreateRoleDto} createRoleDto 创建参数
   * @returns {Promise<Role>} 创建后的角色记录
   */
  async create(createRoleDto: CreateRoleDto) {
    const role = await this.sysRoleModel.create(createRoleDto as any);
    if (createRoleDto.menu_ids && createRoleDto.menu_ids.length > 0) {
      const roleMenus = createRoleDto.menu_ids.map((menuId) => ({
        role_id: role.role_id,
        menu_id: menuId,
      }));

      await this.sysRoleMenuModel.bulkCreate(roleMenus as any);
    }
    return role;
  }

  /**
   * 更新角色
   *
   * 当传入 menu_ids 时，会重建该角色与菜单的关联关系。
   *
   * @async
   * @param {UpdateRoleDto} updateRoleDto 更新参数
   * @returns {Promise<{ role_id: number }>} 更新后的角色ID
   */
  async update(updateRoleDto: UpdateRoleDto) {
    const { role_id, menu_ids, ...data } = updateRoleDto;
    // 更新需要把空值过滤
    const pureData = filterObj(
      data,
      (_, el) => !isNull(el) || !isUndefined(el),
    );
    console.log('pureData', JSON.stringify(pureData, null, 2));
    await this.sysRoleModel.update(pureData, { where: { role_id } });
    if (menu_ids) {
      await this.sysRoleMenuModel.destroy({ where: { role_id } });
      if (menu_ids.length > 0) {
        const roleMenus = menu_ids.map((menuId) => ({
          role_id,
          menu_id: menuId,
        }));
        await this.sysRoleMenuModel.bulkCreate(roleMenus as any);
      }
    }
    return { role_id };
  }

  /**
   * 逻辑删除角色
   *
   * @async
   * @param {string} roleIds 角色ID列表（逗号分隔）
   * @returns {Promise<[number, Role[]]>} Sequelize 更新结果
   */
  async delete(roleIds: string) {
    const ids = roleIds.split(',');
    return this.sysRoleModel.update(
      { del_flag: '2' },
      { where: { role_id: ids } },
    );
  }

  /**
   * 修改角色状态
   *
   * @async
   * @param {ChangeRoleStatusDto} body 状态变更参数
   * @returns {Promise<[number, Role[]]>} Sequelize 更新结果
   */
  async changeStatus(body: ChangeRoleStatusDto) {
    const { role_id, status } = body;
    return this.sysRoleModel.update({ status }, { where: { role_id } });
  }
}

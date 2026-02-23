import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysRole } from '@/databases/mysql-database/model/sys-role.model';
import { SysRoleInter } from '@/databases/mysql-database/interfaces/sys-role.interface';
import { SysRoleMenu } from '@/databases/mysql-database/model/sys-role-menu.model';
import { SysRoleDept } from '@/databases/mysql-database/model/sys-role-dept.model';
import { Op, where } from 'sequelize';


import {
  ListRoleDto,
  CreateRoleDto,
  UpdateRoleDto,
  ChangeRoleStatusDto,
} from './dto/sys-role.dto';
import { filterObj, isNull, isUndefined } from '@/tools';

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
   * @param {typeof SysRole} sysRoleModel 角色模型
   * @param {typeof SysRoleMenu} sysRoleMenuModel 角色-菜单关联模型
   * @param {typeof SysRoleDept} sysRoleDeptModel 角色-部门关联模型
   */
  constructor(
    @InjectModel(SysRole)
    private readonly sysRoleModel: typeof SysRole,
    @InjectModel(SysRoleMenu)
    private readonly sysRoleMenuModel: typeof SysRoleMenu,
    @InjectModel(SysRoleDept)
    private readonly sysRoleDeptModel: typeof SysRoleDept,
  ) {}

  /**
   * 角色分页列表查询
   *
   * @async
   * @param {ListRoleDto} query 查询参数
   * @returns {Promise<{ rows: SysRole[]; total: number }>} 分页结果
   */
  async findAll(query: ListRoleDto) {
    const { pageNum = 1, pageSize = 20, role_name, role_key, status } = query;

    const where: any = { del_flag: '0' };
    if (role_name) where.role_name = { [Op.like]: `%${role_name}%` };
    if (role_key) where.role_key = { [Op.like]: `%${role_key}%` };
    if (status) where.status = status;

    const { rows, count } = await this.sysRoleModel.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: +pageSize,
      order: [['create_time', 'DESC']],
    });

    return { rows, total: count };
  }

  /**
   * 获取角色详情
   *
   * @async
   * @param {number} roleId 角色ID
   * @returns {Promise<SysRole | null>} 角色记录
   */
  async findOne(roleId: number) {
    const roleDetail = await this.sysRoleModel.findOne<SysRole>({
      where:{role_id:roleId},
    });
    if(!roleDetail) return null;
    const {role_id} = roleDetail;
    const menuRow = await this.sysRoleMenuModel.findAll<SysRoleMenu>({
      where:{
        role_id
      }
    });
    const menu_ids = menuRow.map(v=>v.menu_id);
    return {...roleDetail.dataValues,menu_ids};
  }
  /**
   * 创建角色
   *
   * 如传入 menu_ids，会创建角色与菜单的关联关系。
   *
   * @async
   * @param {CreateRoleDto} createRoleDto 创建参数
   * @returns {Promise<SysRole>} 创建后的角色记录
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
    const pureData = filterObj(data,(_,el)=>!isNull(el) ||!isUndefined(el));
    console.log('pureData',JSON.stringify(pureData,null,2))
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
   * @returns {Promise<[number, SysRole[]]>} Sequelize 更新结果
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
   * @returns {Promise<[number, SysRole[]]>} Sequelize 更新结果
   */
  async changeStatus(body: ChangeRoleStatusDto) {
    const { role_id, status } = body;
    return this.sysRoleModel.update({ status }, { where: { role_id } });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysRole } from '@/databases/mysql-database/model/sys-role.model';
import { SysRoleMenu } from '@/databases/mysql-database/model/sys-role-menu.model';
import { SysRoleDept } from '@/databases/mysql-database/model/sys-role-dept.model';
import { Op } from 'sequelize';

import {
  ListRoleDto,
  CreateRoleDto,
  UpdateRoleDto,
  ChangeRoleStatusDto,
} from './dto/sys-role.dto';

@Injectable()
export class SysRoleService {
  constructor(
    @InjectModel(SysRole)
    private readonly sysRoleModel: typeof SysRole,
    @InjectModel(SysRoleMenu)
    private readonly sysRoleMenuModel: typeof SysRoleMenu,
    @InjectModel(SysRoleDept)
    private readonly sysRoleDeptModel: typeof SysRoleDept,
  ) {}

  async findAll(query: ListRoleDto) {
    const { pageNum = 1, pageSize = 20, role_name, role_key, status } = query;

    // @ts-ignore
    const where: any = { del_flag: '0' };
    if (role_name) where.role_name = { [Op.like]: `%${role_name}%` };
    if (role_key) where.role_key = { [Op.like]: `%${role_key}%` };
    if (status) where.status = status;

    const { rows, count } = await this.sysRoleModel.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: +pageSize,
      order: [['role_sort', 'ASC']],
    });

    return { rows, total: count };
  }

  async findOne(roleId: number) {
    return this.sysRoleModel.findByPk(roleId);
  }

  async create(createRoleDto: CreateRoleDto) {
    // @ts-ignore
    const role = await this.sysRoleModel.create(createRoleDto);
    if (createRoleDto.menu_ids && createRoleDto.menu_ids.length > 0) {
      const roleMenus = createRoleDto.menu_ids.map((menuId) => ({
        role_id: role.role_id,
        menu_id: menuId,
      }));

      // @ts-ignore
      await this.sysRoleMenuModel.bulkCreate(roleMenus);
    }
    return role;
  }

  async update(updateRoleDto: UpdateRoleDto) {
    const { role_id, menu_ids, ...data } = updateRoleDto;
    await this.sysRoleModel.update(data, { where: { role_id } });

    if (menu_ids) {
      await this.sysRoleMenuModel.destroy({ where: { role_id } });
      if (menu_ids.length > 0) {
        const roleMenus = menu_ids.map((menuId) => ({
          role_id,
          menu_id: menuId,
        }));

        // @ts-ignore
        await this.sysRoleMenuModel.bulkCreate(roleMenus);
      }
    }
    return { role_id };
  }

  async delete(roleIds: string) {
    const ids = roleIds.split(',');
    return this.sysRoleModel.update(
      // @ts-ignore
      { del_flag: '2' },
      { where: { role_id: ids } },
    );
  }

  async changeStatus(body: ChangeRoleStatusDto) {
    const { role_id, status } = body;
    return this.sysRoleModel.update({ status }, { where: { role_id } });
  }
}

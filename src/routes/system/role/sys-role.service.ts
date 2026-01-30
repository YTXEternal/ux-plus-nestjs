import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysRole } from '@/databases/mysql-database/model/sys-role.model';
import { SysMenu } from '@/databases/mysql-database/model/sys-menu.model';
import { SysRoleMenu } from '@/databases/mysql-database/model/sys-role-menu.model';
import { Op } from 'sequelize';

@Injectable()
export class SysRoleService {
  constructor(
    @InjectModel(SysRole)
    private readonly sysRoleModel: typeof SysRole,
    @InjectModel(SysRoleMenu)
    private readonly sysRoleMenuModel: typeof SysRoleMenu,
  ) {}

  async findAll(query: any) {
    const { pageNum = 1, pageSize = 10, roleName, roleKey, status } = query;
    const where: any = { del_flag: '0' };
    if (roleName) where.role_name = { [Op.like]: `%${roleName}%` };
    if (roleKey) where.role_key = { [Op.like]: `%${roleKey}%` };
    if (status) where.status = status;

    const { rows, count } = await this.sysRoleModel.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: +pageSize,
    });
    return { rows, total: count };
  }

  async findOne(roleId: number) {
    return { data: await this.sysRoleModel.findByPk(roleId) };
  }

  async create(createRoleDto: any) {
    const role = await this.sysRoleModel.create(createRoleDto);
    // TODO: save menus
    return role;
  }

  async update(updateRoleDto: any) {
    const { role_id, ...data } = updateRoleDto;
    return this.sysRoleModel.update(data, { where: { role_id } });
  }

  async delete(roleIds: string) {
    const ids = roleIds.split(',');
    return this.sysRoleModel.update(
      { del_flag: '2' },
      { where: { role_id: ids } },
    );
  }

  async changeStatus(body: any) {
    const { role_id, status } = body;
    return this.sysRoleModel.update({ status }, { where: { role_id } });
  }
}

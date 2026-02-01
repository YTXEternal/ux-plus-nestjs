import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysMenu } from '@/databases/mysql-database/model/sys-menu.model';
import { SysRoleMenu } from '@/databases/mysql-database/model/sys-role-menu.model';
import { Op } from 'sequelize';

import { ListMenuDto, CreateMenuDto, UpdateMenuDto } from './dto/sys-menu.dto';

@Injectable()
export class SysMenuService {
  constructor(
    @InjectModel(SysMenu)
    private readonly sysMenuModel: typeof SysMenu,
    @InjectModel(SysRoleMenu)
    private readonly sysRoleMenuModel: typeof SysRoleMenu,
  ) {}

  async findAll(query: ListMenuDto) {
    const { menu_name, status } = query;
    const where: any = { status: '0' }; // TODO: handle del_flag/status logic better
    if (menu_name) where.menu_name = { [Op.like]: `%${menu_name}%` };
    if (status) where.status = status;

    const menus = await this.sysMenuModel.findAll({
      where,
      order: [['order_num', 'ASC']],
    });
    return menus;
  }

  async findOne(menuId: number) {
    return this.sysMenuModel.findByPk(menuId);
  }

  async create(createMenuDto: CreateMenuDto) {
    // @ts-ignore
    return this.sysMenuModel.create(createMenuDto);
  }

  async update(updateMenuDto: UpdateMenuDto) {
    const { menu_id, ...data } = updateMenuDto;
    return this.sysMenuModel.update(data, { where: { menu_id } });
  }

  async delete(menuId: number) {
    // Check if has children
    const count = await this.sysMenuModel.count({
      where: { parent_id: menuId },
    });
    if (count > 0) throw new Error('Exist child menu, can not delete');
    return this.sysMenuModel.destroy({ where: { menu_id: menuId } });
  }
}

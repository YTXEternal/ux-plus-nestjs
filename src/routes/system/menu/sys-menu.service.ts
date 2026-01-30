import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysMenu } from '@/databases/mysql-database/model/sys-menu.model';
import { Op } from 'sequelize';

@Injectable()
export class SysMenuService {
  constructor(
    @InjectModel(SysMenu)
    private readonly sysMenuModel: typeof SysMenu,
  ) {}

  async findAll(query: any) {
    const { menuName, status } = query;
    const where: any = {};
    if (menuName) where.menu_name = { [Op.like]: `%${menuName}%` };
    if (status) where.status = status;
    return this.sysMenuModel.findAll({ where, order: [['order_num', 'ASC']] });
  }

  async findOne(menuId: number) {
    return this.sysMenuModel.findByPk(menuId);
  }

  async create(createMenuDto: any) {
    return this.sysMenuModel.create(createMenuDto);
  }

  async update(updateMenuDto: any) {
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

  async getTreeSelect() {
    // Should build tree structure
    const menus = await this.sysMenuModel.findAll({
      order: [['order_num', 'ASC']],
    });
    return this.buildTree(menus);
  }

  private buildTree(menus: SysMenu[]) {
    // Simple implementation
    // Ideally use a recursive function to build tree
    return menus;
  }
}

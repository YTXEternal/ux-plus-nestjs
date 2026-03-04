import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Arrange } from '@/databases/mysql-database/model/arrange.model';
import { SysDrama } from '@/databases/mysql-database/model/sys-drama.model';
import { Shop } from '@/databases/mysql-database/model/shop.model';
import {
  CreateArrangeDto,
  ListArrangeDto,
  UpdateArrangeDto,
} from './dto/arrange.dto';
import { Op } from 'sequelize';

@Injectable()
export class ArrangeService {
  constructor(
    @InjectModel(Arrange)
    private readonly arrangeModel: typeof Arrange,
  ) {}

  /**
   * 创建排场
   */
  async create(createArrangeDto: CreateArrangeDto) {
    return this.arrangeModel.create({
      ...createArrangeDto,
      create_time: new Date(),
      update_time: new Date(),
    } as any);
  }

  /**
   * 分页查询排场列表
   */
  async findAll(query: ListArrangeDto) {
    const { pageNum = 1, pageSize = 10, name, status, shop_id } = query;
    const where: any = { del_flag: '0' };

    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }

    if (shop_id) {
      where.shop_id = shop_id;
    }

    if (status) {
      const now = new Date();
      if (status === 1) {
        // 已开场 (start_time <= now)
        where.start_time = { [Op.lte]: now };
      } else if (status === 2) {
        // 未开场 (start_time > now)
        where.start_time = { [Op.gt]: now };
      }
    }

    const { rows, count } = await this.arrangeModel.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      order: [['create_time', 'DESC']],
      include: [
        { model: SysDrama, attributes: ['name'] },
        { model: Shop, attributes: ['name'] },
      ],
    });

    return { rows, total: count };
  }

  /**
   * 查询所有排场列表（无分页）
   */
  async findAllNoPage(query: ListArrangeDto) {
    const { name, status, shop_id } = query;
    const where: any = { del_flag: '0' };

    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }

    if (shop_id) {
      where.shop_id = shop_id;
    }

    if (status) {
      const now = new Date();
      if (status === 1) {
        // 已开场
        where.start_time = { [Op.lte]: now };
      } else if (status === 2) {
        // 未开场
        where.start_time = { [Op.gt]: now };
      }
    }

    return this.arrangeModel.findAll({
      where,
      order: [['create_time', 'DESC']],
      include: [
        { model: SysDrama, attributes: ['name'] },
        { model: Shop, attributes: ['name'] },
      ],
    });
  }

  /**
   * 查询排场详情
   */
  async findOne(id: number) {
    return this.arrangeModel.findByPk(id, {
      include: [
        { model: SysDrama },
        { model: Shop, attributes: ['name'] },
      ],
    });
  }

  /**
   * 更新排场
   */
  async update(updateArrangeDto: UpdateArrangeDto) {
    const { arrange_id, ...data } = updateArrangeDto;
    return this.arrangeModel.update(
      { ...data, update_time: new Date() },
      { where: { arrange_id } },
    );
  }

  /**
   * 删除排场
   */
  async remove(ids: number[]) {
    return this.arrangeModel.update(
      { del_flag: '2', update_time: new Date() },
      { where: { arrange_id: ids } },
    );
  }
}

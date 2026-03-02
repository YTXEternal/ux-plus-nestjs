import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysDrama } from '@/databases/mysql-database/model/sys-drama.model';
import { Shop } from '@/databases/mysql-database/model/shop.model';
import { Label } from '@/databases/mysql-database/model/label.model';
import {
  CreateDramaDto,
  UpdateDramaDto,
  ListDramaDto,
  UpdateDramaStatusDto,
} from './dto/drama.dto';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class DramaService {
  constructor(
    @InjectModel(SysDrama)
    private readonly dramaModel: typeof SysDrama,
    @InjectModel(Shop)
    private readonly shopModel: typeof Shop,
    @InjectModel(Label)
    private readonly labelModel: typeof Label,
    private sequelize: Sequelize,
  ) {}

  /**
   * 创建剧本
   * @param createDramaDto
   */
  async create(createDramaDto: CreateDramaDto) {
    const { shop_ids, label_ids, valid_start_time, valid_end_time, ...rest } =
      createDramaDto;
    const data: any = { ...rest };
    if (valid_start_time) data.valid_start_time = new Date(valid_start_time);
    if (valid_end_time) data.valid_end_time = new Date(valid_end_time);

    const transaction = await this.sequelize.transaction();
    try {
      const drama = await this.dramaModel.create(data, { transaction });
      if (shop_ids && shop_ids.length > 0) {
        await drama.$set('shops', shop_ids, { transaction });
      }
      if (label_ids && label_ids.length > 0) {
        await drama.$set('labels', label_ids, { transaction });
      }
      await transaction.commit();
      return drama;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 查询剧本列表
   * @param query
   */
  async findAll(query: ListDramaDto) {
    const {
      pageNum = 1,
      pageSize = 10,
      name,
      valid_status,
      del_flag,
      status,
    } = query;
    const where: any = {};

    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }
    if (del_flag) {
      where.del_flag = del_flag;
    }
    if (status) {
      where.status = status;
    }

    if (valid_status) {
      const now = new Date();
      if (valid_status === 1) {
        // 未过期: valid_end_time >= now OR valid_end_time IS NULL
        where[Op.or] = [
          { valid_end_time: { [Op.gte]: now } },
          { valid_end_time: null },
        ];
      } else if (valid_status === 2) {
        // 已过期: valid_end_time < now
        where.valid_end_time = { [Op.lt]: now };
      }
    }

    const { rows, count } = await this.dramaModel.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      order: [['create_time', 'DESC']],
      include: [
        {
          model: Shop,
          attributes: ['shop_id', 'name'],
          through: { attributes: [] },
        },
        {
          model: Label,
          attributes: ['label_id', 'name'],
          through: { attributes: [] },
        },
      ],
      distinct: true,
    });

    return { rows, total: count };
  }

  /**
   * 查询剧本详情
   * @param id
   */
  async findOne(id: number) {
    return this.dramaModel.findByPk(id, {
      include: [
        { model: Shop, through: { attributes: [] } },
        { model: Label, through: { attributes: [] } },
      ],
    });
  }

  /**
   * 更新剧本信息
   * @param updateDramaDto
   */
  async update(updateDramaDto: UpdateDramaDto) {
    const {
      event_id,
      shop_ids,
      label_ids,
      valid_start_time,
      valid_end_time,
      ...rest
    } = updateDramaDto;
    const data: any = { ...rest };
    if (valid_start_time) data.valid_start_time = new Date(valid_start_time);
    if (valid_end_time) data.valid_end_time = new Date(valid_end_time);

    const transaction = await this.sequelize.transaction();
    try {
      const drama = await this.dramaModel.findByPk(event_id);
      if (!drama) {
        throw new Error('剧本不存在');
      }
      await drama.update(data, { transaction });

      if (shop_ids !== undefined) {
        await drama.$set('shops', shop_ids, { transaction });
      }
      if (label_ids !== undefined) {
        await drama.$set('labels', label_ids, { transaction });
      }

      await transaction.commit();
      return drama;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 更新剧本状态
   * @param updateDramaStatusDto
   */
  async updateStatus(updateDramaStatusDto: UpdateDramaStatusDto) {
    const { event_id, status } = updateDramaStatusDto;
    return this.dramaModel.update({ status }, { where: { event_id } });
  }

  /**
   * 删除剧本（软删除）
   * @param ids
   */
  async remove(ids: number[]) {
    return this.dramaModel.update(
      { del_flag: '2' },
      { where: { event_id: ids } },
    );
  }
}

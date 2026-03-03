import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysDramaPrice } from '@/databases/mysql-database/model/sys-drama-price.model';
import {
  CreateDramaPriceDto,
  ListDramaPriceDto,
  UpdateDramaPriceDto,
} from './dto/drama-price.dto';
import { formatPagination } from '@/tools/pagination';
import { Request } from 'express';

@Injectable()
export class DramaPriceService {
  constructor(
    @InjectModel(SysDramaPrice)
    private readonly sysDramaPriceModel: typeof SysDramaPrice,
  ) {}

  /**
   * 新增定价
   * @param createDto
   * @param req
   * @returns
   */
  async create(createDto: CreateDramaPriceDto, req: Request) {
    return await this.sysDramaPriceModel.create({
      ...createDto,
      del_flag: '0',
    } as any);
  }

  /**
   * 删除定价
   * @param id
   * @returns
   */
  async remove(id: number) {
    return await this.sysDramaPriceModel.update(
      { del_flag: '2' },
      { where: { dramaprice_id: id } },
    );
  }

  /**
   * 修改定价
   * @param updateDto
   * @returns
   */
  async update(updateDto: UpdateDramaPriceDto) {
    const { dramaprice_id, ...data } = updateDto;
    return await this.sysDramaPriceModel.update(data, {
      where: { dramaprice_id },
    });
  }

  /**
   * 定价详情
   * @param id
   * @returns
   */
  async findOne(id: number) {
    return await this.sysDramaPriceModel.findOne({
      where: { dramaprice_id: id, del_flag: '0' },
    });
  }

  /**
   * 定价列表
   * @param query
   * @returns
   */
  async findAll(query: ListDramaPriceDto) {
    const { pageNum = 1, pageSize = 10, shop_id, drama_id } = query;
    const where: any = { del_flag: '0' };

    if (shop_id) {
      where.shop_id = shop_id;
    }

    if (drama_id) {
      where.drama_id = drama_id;
    }

    const { rows, count } = await this.sysDramaPriceModel.findAndCountAll({
      where,
      offset: (Number(pageNum) - 1) * Number(pageSize),
      limit: Number(pageSize),
      order: [['create_time', 'DESC']],
    });

    return formatPagination(rows, count, Number(pageNum), Number(pageSize));
  }
}

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Shop } from '@/databases/mysql-database/model/shop.model';
import { CreateShopDto, UpdateShopDto, ListShopDto } from './dto/shop.dto';
import { Op } from 'sequelize';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(Shop)
    private readonly shopModel: typeof Shop,
  ) {}

  /**
   * 创建门店
   * @param createShopDto
   */
  async create(createShopDto: CreateShopDto) {
    // 检查名称唯一性
    const exist = await this.shopModel.findOne({
      where: { name: createShopDto.name, del_flag: '0' },
    });
    if (exist) {
      throw new HttpException('门店名称已存在', HttpStatus.BAD_REQUEST);
    }
    return this.shopModel.create(createShopDto as any);
  }

  /**
   * 查询门店列表
   * @param query
   */
  async findAll(query: ListShopDto) {
    const { pageNum = 1, pageSize = 10, name, address, del_flag } = query;
    const where: any = {};

    if (del_flag) {
      where.del_flag = del_flag;
    } else {
      where.del_flag = '0';
    }

    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }
    if (address) {
      where.address = { [Op.like]: `%${address}%` };
    }

    const { rows, count } = await this.shopModel.findAndCountAll({
      where,
      offset: (+pageNum - 1) * +pageSize,
      limit: +pageSize,
      order: [['create_time', 'DESC']],
    });

    return { rows, total: count };
  }

  /**
   * 查询门店详情
   * @param id
   */
  async findOne(id: number) {
    return this.shopModel.findOne({
      where: {
        shop_id: id,
      },
    });
  }

  /**
   * 更新门店信息
   * @param updateShopDto
   */
  async update(updateShopDto: UpdateShopDto) {
    const { shop_id, ...data } = updateShopDto;

    // 检查是否存在
    const shop = await this.shopModel.findByPk(shop_id);
    if (!shop) {
      throw new HttpException('门店不存在', HttpStatus.NOT_FOUND);
    }

    // 如果修改了名称，检查重复
    if (data.name && data.name !== shop.name) {
      const exist = await this.shopModel.findOne({
        where: {
          name: data.name,
          del_flag: '0',
          shop_id: { [Op.ne]: shop_id },
        },
      });
      if (exist) {
        throw new HttpException('门店名称已存在', HttpStatus.BAD_REQUEST);
      }
    }

    return this.shopModel.update(data, {
      where: {
        shop_id,
      },
    });
  }

  /**
   * 删除门店（软删除）
   * @param ids
   */
  async delete(ids: number[]) {
    return this.shopModel.update(
      { del_flag: '2' },
      {
        where: {
          shop_id: ids,
        },
      },
    );
  }

  /**
   * 获取所有门店（不分页）
   */
  async findFullData() {
    return this.shopModel.findAll({
      where: {
        del_flag: '0',
      },
      order: [['create_time', 'DESC']],
    });
  }
}

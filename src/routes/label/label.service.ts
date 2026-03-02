import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Label } from '@/databases/mysql-database/model/label.model';
import {
  CreateLabelDto,
  UpdateLabelDto,
  ListLabelDto,
  ChangeStatusLabelDto,
} from './dto/label.dto';
import { Op } from 'sequelize';

@Injectable()
export class LabelService {
  constructor(
    @InjectModel(Label)
    private readonly labelModel: typeof Label,
  ) {}

  /**
   * 创建标签
   * @param createLabelDto
   */
  async create(createLabelDto: CreateLabelDto) {
    // 检查名称唯一性
    const exist = await this.labelModel.findOne({
      where: { name: createLabelDto.name, del_flag: '0' },
    });
    if (exist) {
      throw new HttpException('标签名称已存在', HttpStatus.BAD_REQUEST);
    }
    return this.labelModel.create(createLabelDto as any);
  }

  /**
   * 查询标签列表
   * @param query
   */
  async findAll(query: ListLabelDto) {
    const { pageNum = 1, pageSize = 10, name, status, del_flag } = query;
    const where: any = {};

    if (del_flag) {
      where.del_flag = del_flag;
    } else {
      where.del_flag = '0';
    }

    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }
    if (status) {
      where.status = status;
    }

    const { rows, count } = await this.labelModel.findAndCountAll({
      where,
      offset: (+pageNum - 1) * +pageSize,
      limit: +pageSize,
      order: [['create_time', 'DESC']],
    });

    return { rows, total: count };
  }

  /**
   * 查询标签详情
   * @param id
   */
  async findOne(id: number) {
    return this.labelModel.findOne({
      where: {
        label_id: id,
      },
    });
  }

  /**
   * 更新标签信息
   * @param updateLabelDto
   */
  async update(updateLabelDto: UpdateLabelDto) {
    const { label_id, ...data } = updateLabelDto;

    // 检查是否存在
    const label = await this.labelModel.findByPk(label_id);
    if (!label) {
      throw new HttpException('标签不存在', HttpStatus.NOT_FOUND);
    }

    // 如果修改了名称，检查重复
    if (data.name && data.name !== label.name) {
      const exist = await this.labelModel.findOne({
        where: {
          name: data.name,
          del_flag: '0',
          label_id: { [Op.ne]: label_id },
        },
      });
      if (exist) {
        throw new HttpException('标签名称已存在', HttpStatus.BAD_REQUEST);
      }
    }

    return this.labelModel.update(data, {
      where: {
        label_id,
      },
    });
  }

  /**
   * 修改标签状态
   * @param changeStatusLabelDto
   */
  async changeStatus(changeStatusLabelDto: ChangeStatusLabelDto) {
    const { label_id, status } = changeStatusLabelDto;
    return this.labelModel.update(
      { status },
      {
        where: {
          label_id,
        },
      },
    );
  }

  /**
   * 删除标签（软删除）
   * @param ids
   */
  async delete(ids: number[]) {
    return this.labelModel.update(
      { del_flag: '2' },
      {
        where: {
          label_id: ids,
        },
      },
    );
  }
}

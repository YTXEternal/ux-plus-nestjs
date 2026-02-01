import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysDictType } from '@/databases/mysql-database/model/sys-dict-type.model';
import { SysDictData } from '@/databases/mysql-database/model/sys-dict-data.model';
import { RedisService } from '@/modules/redis/redis.service';
import { Op } from 'sequelize';

import {
  ListDictTypeDto,
  CreateDictTypeDto,
  UpdateDictTypeDto,
  ListDictDataDto,
  CreateDictDataDto,
  UpdateDictDataDto,
} from './dto/sys-dict.dto';

@Injectable()
export class SysDictService {
  constructor(
    @InjectModel(SysDictType)
    private readonly sysDictTypeModel: typeof SysDictType,
    @InjectModel(SysDictData)
    private readonly sysDictDataModel: typeof SysDictData,
    private readonly redisService: RedisService,
  ) {}

  // Type
  async findAllType(query: ListDictTypeDto) {
    const { pageNum = 1, pageSize = 20, dict_name, dict_type, status } = query;

    // @ts-ignore
    const where: any = { del_flag: '0' };
    if (dict_name) where.dict_name = { [Op.like]: `%${dict_name}%` };
    if (dict_type) where.dict_type = { [Op.like]: `%${dict_type}%` };
    if (status) where.status = status;

    const { rows, count } = await this.sysDictTypeModel.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: +pageSize,
      order: [['create_time', 'DESC']],
    });

    return { rows, total: count };
  }

  async findType(dictId: number) {
    return this.sysDictTypeModel.findByPk(dictId);
  }

  async createType(createDictTypeDto: CreateDictTypeDto) {
    // @ts-ignore
    return this.sysDictTypeModel.create(createDictTypeDto);
  }

  async updateType(updateDictTypeDto: UpdateDictTypeDto) {
    const { dict_id, ...data } = updateDictTypeDto;
    return this.sysDictTypeModel.update(data, { where: { dict_id } });
  }

  async deleteType(dictIds: string) {
    const ids = dictIds.split(',');
    return this.sysDictTypeModel.update(
      // @ts-ignore
      { del_flag: '2' },
      { where: { dict_id: ids } },
    );
  }

  // Data
  async findAllData(query: ListDictDataDto) {
    const { pageNum = 1, pageSize = 20, dict_type, dict_label, status } = query;

    // @ts-ignore
    const where: any = { del_flag: '0' };
    if (dict_type) where.dict_type = dict_type;
    if (dict_label) where.dict_label = { [Op.like]: `%${dict_label}%` };
    if (status) where.status = status;

    const { rows, count } = await this.sysDictDataModel.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: +pageSize,
      order: [['dict_sort', 'ASC']],
    });

    return { rows, total: count };
  }

  async findData(dictCode: number) {
    return this.sysDictDataModel.findByPk(dictCode);
  }

  async findDataByType(dictType: string) {
    // @ts-ignore
    return this.sysDictDataModel.findAll({
      // @ts-ignore
      where: { dict_type: dictType, status: '0', del_flag: '0' },
      order: [['dict_sort', 'ASC']],
    });
  }

  async createData(createDictDataDto: CreateDictDataDto) {
    // @ts-ignore
    return this.sysDictDataModel.create(createDictDataDto);
  }

  async updateData(updateDictDataDto: UpdateDictDataDto) {
    const { dict_code, ...data } = updateDictDataDto;
    return this.sysDictDataModel.update(data, { where: { dict_code } });
  }

  async deleteData(dictCodes: string) {
    const codes = dictCodes.split(',');
    return this.sysDictDataModel.destroy({ where: { dict_code: codes } });
  }
}

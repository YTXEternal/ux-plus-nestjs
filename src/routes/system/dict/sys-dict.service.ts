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

/**
 * 系统-字典服务
 *
 * 提供字典类型与字典数据的管理业务能力，并在需要时配合缓存提升查询性能。
 *
 * @export
 * @class SysDictService
 * @typedef {SysDictService}
 */
@Injectable()
export class SysDictService {
  /**
   * 构造函数
   *
   * @param {typeof SysDictType} sysDictTypeModel 字典类型模型
   * @param {typeof SysDictData} sysDictDataModel 字典数据模型
   * @param {RedisService} redisService Redis 缓存服务
   */
  constructor(
    @InjectModel(SysDictType)
    private readonly sysDictTypeModel: typeof SysDictType,
    @InjectModel(SysDictData)
    private readonly sysDictDataModel: typeof SysDictData,
    private readonly redisService: RedisService,
  ) {}

  // Type
  /**
   * 字典类型分页列表查询
   *
   * @async
   * @param {ListDictTypeDto} query 查询参数
   * @returns {Promise<{ rows: SysDictType[]; total: number }>} 分页结果
   */
  async findAllType(query: ListDictTypeDto) {
    const { pageNum = 1, pageSize = 20, dict_name, dict_type, status } = query;

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

  /**
   * 获取字典类型详情
   *
   * @async
   * @param {number} dictId 字典类型ID
   * @returns {Promise<SysDictType | null>} 字典类型记录
   */
  async findType(dictId: number) {
    return this.sysDictTypeModel.findByPk(dictId);
  }

  /**
   * 创建字典类型
   *
   * @async
   * @param {CreateDictTypeDto} createDictTypeDto 创建参数
   * @returns {Promise<SysDictType>} 创建后的字典类型记录
   */
  async createType(createDictTypeDto: CreateDictTypeDto) {
    return this.sysDictTypeModel.create(createDictTypeDto as any);
  }

  /**
   * 更新字典类型
   *
   * @async
   * @param {UpdateDictTypeDto} updateDictTypeDto 更新参数
   * @returns {Promise<[number, SysDictType[]]>} Sequelize 更新结果
   */
  async updateType(updateDictTypeDto: UpdateDictTypeDto) {
    const { dict_id, ...data } = updateDictTypeDto;
    return this.sysDictTypeModel.update(data, { where: { dict_id } });
  }

  /**
   * 逻辑删除字典类型
   *
   * @async
   * @param {string} dictIds 字典类型ID列表（逗号分隔）
   * @returns {Promise<[number, SysDictType[]]>} Sequelize 更新结果
   */
  async deleteType(dictIds: string) {
    const ids = dictIds.split(',');
    return this.sysDictTypeModel.update(
      { del_flag: '2' },
      { where: { dict_id: ids } },
    );
  }

  // Data
  /**
   * 字典数据分页列表查询
   *
   * @async
   * @param {ListDictDataDto} query 查询参数
   * @returns {Promise<{ rows: SysDictData[]; total: number }>} 分页结果
   */
  async findAllData(query: ListDictDataDto) {
    const { pageNum = 1, pageSize = 20, dict_type, dict_label, status } = query;

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

  /**
   * 获取字典数据详情
   *
   * @async
   * @param {number} dictCode 字典数据编码
   * @returns {Promise<SysDictData | null>} 字典数据记录
   */
  async findData(dictCode: number) {
    return this.sysDictDataModel.findByPk(dictCode);
  }

  /**
   * 按字典类型查询字典数据
   *
   * @async
   * @param {string} dictType 字典类型
   * @returns {Promise<SysDictData[]>} 字典数据列表
   */
  async findDataByType(dictType: string) {
    return this.sysDictDataModel.findAll({
      where: { dict_type: dictType, status: '0', del_flag: '0' },
      order: [['dict_sort', 'ASC']],
    });
  }

  /**
   * 创建字典数据
   *
   * @async
   * @param {CreateDictDataDto} createDictDataDto 创建参数
   * @returns {Promise<SysDictData>} 创建后的字典数据记录
   */
  async createData(createDictDataDto: CreateDictDataDto) {
    return this.sysDictDataModel.create(createDictDataDto as any);
  }

  /**
   * 更新字典数据
   *
   * @async
   * @param {UpdateDictDataDto} updateDictDataDto 更新参数
   * @returns {Promise<[number, SysDictData[]]>} Sequelize 更新结果
   */
  async updateData(updateDictDataDto: UpdateDictDataDto) {
    const { dict_code, ...data } = updateDictDataDto;
    return this.sysDictDataModel.update(data, { where: { dict_code } });
  }

  /**
   * 逻辑删除字典数据
   *
   * @async
   * @param {string} dictCodes 字典数据编码列表（逗号分隔）
   * @returns {Promise<[number, SysDictData[]]>} Sequelize 更新结果
   */
  async deleteData(dictCodes: string) {
    const codes = dictCodes.split(',');
    return this.sysDictDataModel.update(
      { del_flag: '2' },
      { where: { dict_code: codes } },
    );
  }
}

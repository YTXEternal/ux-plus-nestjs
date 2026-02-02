import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysConfig } from '@/databases/mysql-database/model/sys-config.model';
import { RedisService } from '@/modules/redis/redis.service';
import { Op } from 'sequelize';

import {
  ListConfigDto,
  CreateConfigDto,
  UpdateConfigDto,
} from './dto/sys-config.dto';

/**
 * 系统-参数配置服务
 *
 * 提供系统参数配置的管理业务能力，并使用 Redis 缓存按 key 查询的结果以降低数据库压力。
 *
 * @export
 * @class SysConfigService
 * @typedef {SysConfigService}
 */
@Injectable()
export class SysConfigService {
  /**
   * 构造函数
   *
   * @param {typeof SysConfig} sysConfigModel 参数配置模型
   * @param {RedisService} redisService Redis 缓存服务
   */
  constructor(
    @InjectModel(SysConfig)
    private readonly sysConfigModel: typeof SysConfig,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 参数配置分页列表查询
   *
   * @async
   * @param {ListConfigDto} query 查询参数
   * @returns {Promise<{ rows: SysConfig[]; total: number }>} 分页结果
   */
  async findAll(query: ListConfigDto) {
    const {
      pageNum = 1,
      pageSize = 20,
      config_name,
      config_key,
      config_type,
    } = query;

    const where: any = {};
    if (config_name) where.config_name = { [Op.like]: `%${config_name}%` };
    if (config_key) where.config_key = { [Op.like]: `%${config_key}%` };
    if (config_type) where.config_type = config_type;

    const { rows, count } = await this.sysConfigModel.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: +pageSize,
      order: [['create_time', 'DESC']],
    });

    return { rows, total: count };
  }

  /**
   * 获取参数配置详情
   *
   * @async
   * @param {number} configId 配置ID
   * @returns {Promise<SysConfig | null>} 配置记录
   */
  async findOne(configId: number) {
    return this.sysConfigModel.findByPk(configId);
  }

  /**
   * 按 key 查询参数配置（带缓存）
   *
   * @async
   * @param {string} configKey 配置 key
   * @returns {Promise<SysConfig | null>} 配置记录
   */
  async findByKey(configKey: string) {
    const cacheKey = `sys_config:${configKey}`;
    const cached = await this.redisService.getCatche<SysConfig>(cacheKey);
    if (cached) return cached;

    const config = await this.sysConfigModel.findOne({
      where: { config_key: configKey },
    });

    if (config) {
      await this.redisService.setCache(cacheKey, config, 60);
    }

    return config;
  }

  /**
   * 创建参数配置
   *
   * @async
   * @param {CreateConfigDto} createConfigDto 创建参数
   * @returns {Promise<SysConfig>} 创建后的配置记录
   */
  async create(createConfigDto: CreateConfigDto) {
    // @ts-ignore
    return this.sysConfigModel.create(createConfigDto);
  }

  /**
   * 更新参数配置
   *
   * @async
   * @param {UpdateConfigDto} updateConfigDto 更新参数
   * @returns {Promise<[number, SysConfig[]]>} Sequelize 更新结果
   */
  async update(updateConfigDto: UpdateConfigDto) {
    const { config_id, ...data } = updateConfigDto;
    return this.sysConfigModel.update(data, { where: { config_id } });
  }

  /**
   * 删除参数配置
   *
   * @async
   * @param {string} configIds 配置ID列表（逗号分隔）
   * @returns {Promise<number>} 删除的记录数
   */
  async delete(configIds: string) {
    const ids = configIds.split(',');
    return this.sysConfigModel.destroy({ where: { config_id: ids } });
  }
}

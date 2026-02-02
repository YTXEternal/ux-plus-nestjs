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

@Injectable()
export class SysConfigService {
  constructor(
    @InjectModel(SysConfig)
    private readonly sysConfigModel: typeof SysConfig,
    private readonly redisService: RedisService,
  ) {}

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

  async findOne(configId: number) {
    return this.sysConfigModel.findByPk(configId);
  }

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

  async create(createConfigDto: CreateConfigDto) {
    // @ts-ignore
    return this.sysConfigModel.create(createConfigDto);
  }

  async update(updateConfigDto: UpdateConfigDto) {
    const { config_id, ...data } = updateConfigDto;
    return this.sysConfigModel.update(data, { where: { config_id } });
  }

  async delete(configIds: string) {
    const ids = configIds.split(',');
    return this.sysConfigModel.destroy({ where: { config_id: ids } });
  }
}

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
      pageSize = 10,
      configName,
      configKey,
      configType,
    } = query;

    // @ts-ignore
    const where: any = { del_flag: '0' };
    if (configName) where.config_name = { [Op.like]: `%${configName}%` };
    if (configKey) where.config_key = { [Op.like]: `%${configKey}%` };
    if (configType) where.config_type = configType;

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
    // @ts-ignore
    return this.sysConfigModel.findOne({
      // @ts-ignore
      where: { config_key: configKey, del_flag: '0' },
    });
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

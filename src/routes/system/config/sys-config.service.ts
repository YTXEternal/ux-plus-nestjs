import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysConfig } from '@/databases/mysql-database/model/sys-config.model';
import { Op } from 'sequelize';

@Injectable()
export class SysConfigService {
  constructor(
    @InjectModel(SysConfig)
    private readonly sysConfigModel: typeof SysConfig,
  ) {}

  async findAll(query: any) {
    const {
      pageNum = 1,
      pageSize = 10,
      configName,
      configKey,
      configType,
    } = query;
    const where: any = {};
    if (configName) where.config_name = { [Op.like]: `%${configName}%` };
    if (configKey) where.config_key = { [Op.like]: `%${configKey}%` };
    if (configType) where.config_type = configType;

    const { rows, count } = await this.sysConfigModel.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: +pageSize,
    });
    return { rows, total: count };
  }

  async findOne(configId: number) {
    return this.sysConfigModel.findByPk(configId);
  }

  async findByKey(configKey: string) {
    return this.sysConfigModel.findOne({ where: { config_key: configKey } });
  }

  async create(createConfigDto: any) {
    return this.sysConfigModel.create(createConfigDto);
  }

  async update(updateConfigDto: any) {
    const { config_id, ...data } = updateConfigDto;
    return this.sysConfigModel.update(data, { where: { config_id } });
  }

  async delete(configIds: string) {
    const ids = configIds.split(',');
    return this.sysConfigModel.destroy({ where: { config_id: ids } });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysFile } from '@/databases/mysql-database/model/sys-file.model';
import { Op } from 'sequelize';
import { ListFileDto } from './dto/file.dto';
import { formatPagination } from '@/tools/pagination';

/**
 * 文件管理服务
 * @class SysFileService
 */
@Injectable()
export class SysFileService {
  constructor(
    @InjectModel(SysFile)
    private readonly sysFileModel: typeof SysFile,
  ) {}

  /**
   * 分页查询文件列表
   * @param query 查询参数
   */
  async findAll(query: ListFileDto) {
    const { pageNum = 1, pageSize = 20, name, type, del_flag } = query;

    const where: any = {};
    if (del_flag) {
      where.del_flag = del_flag;
    } else {
      where.del_flag = '0'; // 默认查询未删除的
    }

    if (name) where.name = { [Op.like]: `%${name}%` };
    if (type) where.type = type;

    const { rows, count } = await this.sysFileModel.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: +pageSize,
      order: [['create_time', 'DESC']],
    });

    return formatPagination(rows, count, +pageNum, +pageSize);
  }

  /**
   * 获取文件详情
   * @param fileId 文件ID
   */
  async findOne(fileId: number) {
    return this.sysFileModel.findByPk(fileId);
  }

  /**
   * 保存文件信息
   * @param fileData 文件信息
   */
  async create(fileData: { name: string; type: string; url: string }) {
    return this.sysFileModel.create({
      name: fileData.name,
      type: fileData.type,
      url: fileData.url,
      del_flag: '0',
    } as any);
  }

  /**
   * 逻辑删除文件
   * @param fileIds 文件ID列表
   */
  async delete(fileIds: string) {
    const ids = fileIds.split(',');
    return this.sysFileModel.update(
      { del_flag: '2' },
      { where: { file_id: ids } },
    );
  }
}

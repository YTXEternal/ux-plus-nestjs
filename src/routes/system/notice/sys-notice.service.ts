import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysNotice } from '@/databases/mysql-database/model/sys-notice.model';
import { Op } from 'sequelize';

import {
  ListNoticeDto,
  CreateNoticeDto,
  UpdateNoticeDto,
} from './dto/sys-notice.dto';

/**
 * 系统-通知公告服务
 *
 * 提供通知公告管理相关业务能力（分页查询、详情、创建、更新、逻辑删除等）。
 *
 * @export
 * @class SysNoticeService
 * @typedef {SysNoticeService}
 */
@Injectable()
export class SysNoticeService {
  /**
   * 构造函数
   *
   * @param {typeof SysNotice} sysNoticeModel 通知公告模型
   */
  constructor(
    @InjectModel(SysNotice)
    private readonly sysNoticeModel: typeof SysNotice,
  ) {}

  /**
   * 通知公告分页列表查询
   *
   * @async
   * @param {ListNoticeDto} query 查询参数
   * @returns {Promise<{ rows: SysNotice[]; total: number }>} 分页结果
   */
  async findAll(query: ListNoticeDto) {
    const {
      pageNum = 1,
      pageSize = 20,
      notice_title,
      notice_type,
      create_by,
    } = query;

    const where: any = { del_flag: '0' };
    if (notice_title) where.notice_title = { [Op.like]: `%${notice_title}%` };
    if (notice_type) where.notice_type = notice_type;
    if (create_by) where.create_by = { [Op.like]: `%${create_by}%` };

    const { rows, count } = await this.sysNoticeModel.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: +pageSize,
      order: [['create_time', 'DESC']],
    });

    return { rows, total: count };
  }

  /**
   * 获取通知公告详情
   *
   * @async
   * @param {number} noticeId 通知公告ID
   * @returns {Promise<SysNotice | null>} 通知公告记录
   */
  async findOne(noticeId: number) {
    return this.sysNoticeModel.findByPk(noticeId);
  }

  /**
   * 创建通知公告
   *
   * @async
   * @param {CreateNoticeDto} createNoticeDto 创建参数
   * @returns {Promise<SysNotice>} 创建后的通知公告记录
   */
  async create(createNoticeDto: CreateNoticeDto) {
    return this.sysNoticeModel.create(createNoticeDto as any);
  }

  /**
   * 更新通知公告
   *
   * @async
   * @param {UpdateNoticeDto} updateNoticeDto 更新参数
   * @returns {Promise<[number, SysNotice[]]>} Sequelize 更新结果
   */
  async update(updateNoticeDto: UpdateNoticeDto) {
    const { notice_id, ...data } = updateNoticeDto;
    return this.sysNoticeModel.update(data, { where: { notice_id } });
  }

  /**
   * 逻辑删除通知公告
   *
   * @async
   * @param {string} noticeIds 通知公告ID列表（逗号分隔）
   * @returns {Promise<[number, SysNotice[]]>} Sequelize 更新结果
   */
  async delete(noticeIds: string) {
    const ids = noticeIds.split(',');
    return this.sysNoticeModel.update(
      { del_flag: '2' },
      { where: { notice_id: ids } },
    );
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysNotice } from '@/databases/mysql-database/model/sys-notice.model';
import { Op } from 'sequelize';

import {
  ListNoticeDto,
  CreateNoticeDto,
  UpdateNoticeDto,
} from './dto/sys-notice.dto';

@Injectable()
export class SysNoticeService {
  constructor(
    @InjectModel(SysNotice)
    private readonly sysNoticeModel: typeof SysNotice,
  ) {}

  async findAll(query: ListNoticeDto) {
    const {
      pageNum = 1,
      pageSize = 10,
      noticeTitle,
      noticeType,
      createBy,
    } = query;

    // @ts-ignore
    const where: any = { del_flag: '0' };
    if (noticeTitle) where.notice_title = { [Op.like]: `%${noticeTitle}%` };
    if (noticeType) where.notice_type = noticeType;
    if (createBy) where.create_by = { [Op.like]: `%${createBy}%` };

    const { rows, count } = await this.sysNoticeModel.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: +pageSize,
      order: [['create_time', 'DESC']],
    });

    return { rows, total: count };
  }

  async findOne(noticeId: number) {
    return this.sysNoticeModel.findByPk(noticeId);
  }

  async create(createNoticeDto: CreateNoticeDto) {
    // @ts-ignore
    return this.sysNoticeModel.create(createNoticeDto);
  }

  async update(updateNoticeDto: UpdateNoticeDto) {
    const { notice_id, ...data } = updateNoticeDto;
    return this.sysNoticeModel.update(data, { where: { notice_id } });
  }

  async delete(noticeIds: string) {
    const ids = noticeIds.split(',');
    return this.sysNoticeModel.update(
      // @ts-ignore
      { del_flag: '2' },
      { where: { notice_id: ids } },
    );
  }
}

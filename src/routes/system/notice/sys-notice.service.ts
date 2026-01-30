import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysNotice } from '@/databases/mysql-database/model/sys-notice.model';
import { Op } from 'sequelize';

@Injectable()
export class SysNoticeService {
  constructor(
    @InjectModel(SysNotice)
    private readonly sysNoticeModel: typeof SysNotice,
  ) {}

  async findAll(query: any) {
    const {
      pageNum = 1,
      pageSize = 10,
      noticeTitle,
      createBy,
      noticeType,
    } = query;
    const where: any = {};
    if (noticeTitle) where.notice_title = { [Op.like]: `%${noticeTitle}%` };
    if (createBy) where.create_by = { [Op.like]: `%${createBy}%` };
    if (noticeType) where.notice_type = noticeType;

    const { rows, count } = await this.sysNoticeModel.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: +pageSize,
    });
    return { rows, total: count };
  }

  async findOne(noticeId: number) {
    return this.sysNoticeModel.findByPk(noticeId);
  }

  async create(createNoticeDto: any) {
    return this.sysNoticeModel.create(createNoticeDto);
  }

  async update(updateNoticeDto: any) {
    const { notice_id, ...data } = updateNoticeDto;
    return this.sysNoticeModel.update(data, { where: { notice_id } });
  }

  async delete(noticeIds: string) {
    const ids = noticeIds.split(',');
    return this.sysNoticeModel.destroy({ where: { notice_id: ids } });
  }
}

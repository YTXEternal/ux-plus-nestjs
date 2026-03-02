import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Member } from '@/databases/mysql-database/model/member.model';
import {
  CreateMemberDto,
  UpdateMemberDto,
  ListMemberDto,
} from './dto/member.dto';
import { Op } from 'sequelize';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member)
    private readonly memberModel: typeof Member,
  ) {}

  /**
   * 创建会员
   * @param createMemberDto
   */
  async create(createMemberDto: CreateMemberDto) {
    return this.memberModel.create(createMemberDto as any);
  }

  /**
   * 查询会员列表
   * @param query
   */
  async findAll(query: ListMemberDto) {
    const { pageNum = 1, pageSize = 10, name, phone, email } = query;
    const where: any = {
      del_flag: '0',
    };
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }
    if (phone) {
      where.phone = { [Op.like]: `%${phone}%` };
    }
    if (email) {
      where.email = { [Op.like]: `%${email}%` };
    }

    const { rows, count } = await this.memberModel.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      order: [['create_time', 'DESC']],
    });

    return { rows, total: count };
  }

  /**
   * 查询会员详情
   * @param id
   */
  async findOne(id: number) {
    return this.memberModel.findOne({
      where: {
        member_id: id,
        del_flag: '0',
      },
    });
  }

  /**
   * 更新会员信息
   * @param updateMemberDto
   */
  async update(updateMemberDto: UpdateMemberDto) {
    const { member_id, ...data } = updateMemberDto;
    return this.memberModel.update(data, {
      where: {
        member_id,
        del_flag: '0',
      },
    });
  }

  /**
   * 删除会员（软删除）
   * @param ids
   */
  async delete(ids: number[]) {
    return this.memberModel.update(
      { del_flag: '2' },
      {
        where: {
          member_id: ids,
        },
      },
    );
  }
}

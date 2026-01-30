import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysPost } from '@/databases/mysql-database/model/sys-post.model';
import { Op } from 'sequelize';

@Injectable()
export class SysPostService {
  constructor(
    @InjectModel(SysPost)
    private readonly sysPostModel: typeof SysPost,
  ) {}

  async findAll(query: any) {
    const { pageNum = 1, pageSize = 10, postCode, postName, status } = query;
    const where: any = {};
    if (postCode) where.post_code = { [Op.like]: `%${postCode}%` };
    if (postName) where.post_name = { [Op.like]: `%${postName}%` };
    if (status) where.status = status;

    const { rows, count } = await this.sysPostModel.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: +pageSize,
    });
    return { rows, total: count };
  }

  async findOne(postId: number) {
    return this.sysPostModel.findByPk(postId);
  }

  async create(createPostDto: any) {
    return this.sysPostModel.create(createPostDto);
  }

  async update(updatePostDto: any) {
    const { post_id, ...data } = updatePostDto;
    return this.sysPostModel.update(data, { where: { post_id } });
  }

  async delete(postIds: string) {
    const ids = postIds.split(',');
    return this.sysPostModel.destroy({ where: { post_id: ids } });
  }
}

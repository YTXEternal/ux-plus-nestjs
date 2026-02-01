import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysPost } from '@/databases/mysql-database/model/sys-post.model';
import { Op } from 'sequelize';

import { ListPostDto, CreatePostDto, UpdatePostDto } from './dto/sys-post.dto';

@Injectable()
export class SysPostService {
  constructor(
    @InjectModel(SysPost)
    private readonly sysPostModel: typeof SysPost,
  ) {}

  async findAll(query: ListPostDto) {
    const { pageNum = 1, pageSize = 20, post_code, post_name, status } = query;

    // @ts-ignore
    const where: any = { del_flag: '0' };
    if (post_code) where.post_code = { [Op.like]: `%${post_code}%` };
    if (post_name) where.post_name = { [Op.like]: `%${post_name}%` };
    if (status) where.status = status;

    const { rows, count } = await this.sysPostModel.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: +pageSize,
      order: [['post_sort', 'ASC']],
    });

    return { rows, total: count };
  }

  async findOne(postId: number) {
    return this.sysPostModel.findByPk(postId);
  }

  async create(createPostDto: CreatePostDto) {
    // @ts-ignore
    return this.sysPostModel.create(createPostDto);
  }

  async update(updatePostDto: UpdatePostDto) {
    const { post_id, ...data } = updatePostDto;
    return this.sysPostModel.update(data, { where: { post_id } });
  }

  async delete(postIds: string) {
    const ids = postIds.split(',');
    return this.sysPostModel.update(
      // @ts-ignore
      { del_flag: '2' },
      { where: { post_id: ids } },
    );
  }
}

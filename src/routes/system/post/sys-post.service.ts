import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysPost } from '@/databases/mysql-database/model/sys-post.model';
import { Op } from 'sequelize';

import { ListPostDto, CreatePostDto, UpdatePostDto } from './dto/sys-post.dto';

/**
 * 系统-岗位服务
 *
 * 提供岗位管理相关业务能力（分页查询、详情、创建、更新、逻辑删除等）。
 *
 * @export
 * @class SysPostService
 * @typedef {SysPostService}
 */
@Injectable()
export class SysPostService {
  /**
   * 构造函数
   *
   * @param {typeof SysPost} sysPostModel 岗位模型
   */
  constructor(
    @InjectModel(SysPost)
    private readonly sysPostModel: typeof SysPost,
  ) {}

  /**
   * 岗位分页列表查询
   *
   * @async
   * @param {ListPostDto} query 查询参数
   * @returns {Promise<{ rows: SysPost[]; total: number }>} 分页结果
   */
  async findAll(query: ListPostDto) {
    const { pageNum = 1, pageSize = 20, post_code, post_name, status } = query;

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

  /**
   * 获取岗位详情
   *
   * @async
   * @param {number} postId 岗位ID
   * @returns {Promise<SysPost | null>} 岗位记录
   */
  async findOne(postId: number) {
    return this.sysPostModel.findByPk(postId);
  }

  /**
   * 创建岗位
   *
   * @async
   * @param {CreatePostDto} createPostDto 创建参数
   * @returns {Promise<SysPost>} 创建后的岗位记录
   */
  async create(createPostDto: CreatePostDto) {
    return this.sysPostModel.create(createPostDto as any);
  }

  /**
   * 更新岗位
   *
   * @async
   * @param {UpdatePostDto} updatePostDto 更新参数
   * @returns {Promise<[number, SysPost[]]>} Sequelize 更新结果
   */
  async update(updatePostDto: UpdatePostDto) {
    const { post_id, ...data } = updatePostDto;
    return this.sysPostModel.update(data, { where: { post_id } });
  }

  /**
   * 逻辑删除岗位
   *
   * @async
   * @param {string} postIds 岗位ID列表（逗号分隔）
   * @returns {Promise<[number, SysPost[]]>} Sequelize 更新结果
   */
  async delete(postIds: string) {
    const ids = postIds.split(',');
    return this.sysPostModel.update(
      { del_flag: '2' },
      { where: { post_id: ids } },
    );
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysDept } from '@/databases/mysql-database/model/sys-dept.model';
import { Op } from 'sequelize';
import { SysDeptTree } from './types';

import { ListDeptDto, CreateDeptDto, UpdateDeptDto } from './dto/sys-dept.dto';

/**
 * 系统-部门服务
 *
 * 提供部门管理相关业务能力（查询列表、详情、创建、更新、逻辑删除等）。
 *
 * @export
 * @class SysDeptService
 * @typedef {SysDeptService}
 */
@Injectable()
export class SysDeptService {
  /**
   * 构造函数
   *
   * @param {typeof SysDept} sysDeptModel 部门模型
   */
  constructor(
    @InjectModel(SysDept)
    private readonly sysDeptModel: typeof SysDept,
  ) {}

  /**
   * 查询部门列表
   *
   * @async
   * @param {ListDeptDto} query 查询参数
   * @returns {Promise<SysDeptTree[]>} 部门列表
   */
  async findAll(query: ListDeptDto) {
    const { dept_name, status } = query;

    const where: any = { del_flag: '0' };
    if (dept_name) where.dept_name = { [Op.like]: `%${dept_name}%` };
    if (status) where.status = status;

    const depts = await this.sysDeptModel.findAll({
      where,
      order: [['order_num', 'ASC']],
    });
    return this.buildDeptTree(depts);
  }

  /**
   * 构建部门树
   *
   * @param {SysDept[]} depts 部门列表
   * @returns {SysDeptTree[]} 树形结构
   */
  buildDeptTree(depts: SysDept[]): SysDeptTree[] {
    const deptMap = new Map<number, SysDeptTree>();
    const tree: SysDeptTree[] = [];

    // 1. 初始化 Map
    depts.forEach((dept) => {
      deptMap.set(dept.dept_id, {
        ...dept.toJSON(),
        children: [],
      } as unknown as SysDeptTree);
    });

    // 2. 构建树
    depts.forEach((dept) => {
      const node = deptMap.get(dept.dept_id);
      if (node) {
        if (dept.parent_id === 0) {
          tree.push(node);
        } else {
          const parent = deptMap.get(dept.parent_id);
          if (parent) {
            if (!parent.children) parent.children = [];
            parent.children.push(node);
          } else {
            // 如果找不到父节点，可能父节点被禁用或未选中，视情况处理
            // 这里暂时作为根节点或者忽略
          }
        }
      }
    });

    return tree;
  }

  /**
   * 获取部门详情
   *
   * @async
   * @param {number} deptId 部门ID
   * @returns {Promise<SysDept | null>} 部门记录
   */
  async findOne(deptId: number) {
    return this.sysDeptModel.findByPk(deptId);
  }

  /**
   * 创建部门
   *
   * @async
   * @param {CreateDeptDto} createDeptDto 创建参数
   * @returns {Promise<SysDept>} 创建后的部门记录
   */
  async create(createDeptDto: CreateDeptDto) {
    return this.sysDeptModel.create(createDeptDto as any);
  }

  /**
   * 更新部门
   *
   * @async
   * @param {UpdateDeptDto} updateDeptDto 更新参数
   * @returns {Promise<[number, SysDept[]]>} Sequelize 更新结果
   */
  async update(updateDeptDto: UpdateDeptDto) {
    const { dept_id, ...data } = updateDeptDto;
    return this.sysDeptModel.update(data, { where: { dept_id } });
  }

  /**
   * 逻辑删除部门
   *
   * @async
   * @param {number} deptId 部门ID
   * @returns {Promise<[number, SysDept[]]>} Sequelize 更新结果
   */
  async delete(deptId: number) {
    return this.sysDeptModel.update(
      { del_flag: '2' },
      { where: { dept_id: deptId } },
    );
  }
}

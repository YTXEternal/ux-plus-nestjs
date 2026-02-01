import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysDept } from '@/databases/mysql-database/model/sys-dept.model';
import { Op } from 'sequelize';

import { ListDeptDto, CreateDeptDto, UpdateDeptDto } from './dto/sys-dept.dto';

@Injectable()
export class SysDeptService {
  constructor(
    @InjectModel(SysDept)
    private readonly sysDeptModel: typeof SysDept,
  ) {}

  async findAll(query: ListDeptDto) {
    const { deptName, status } = query;

    // @ts-ignore
    const where: any = { del_flag: '0' };
    if (deptName) where.dept_name = { [Op.like]: `%${deptName}%` };
    if (status) where.status = status;

    const depts = await this.sysDeptModel.findAll({
      where,
      order: [['order_num', 'ASC']],
    });
    return depts;
  }

  async findOne(deptId: number) {
    return this.sysDeptModel.findByPk(deptId);
  }

  async create(createDeptDto: CreateDeptDto) {
    // @ts-ignore
    return this.sysDeptModel.create(createDeptDto);
  }

  async update(updateDeptDto: UpdateDeptDto) {
    const { dept_id, ...data } = updateDeptDto;
    return this.sysDeptModel.update(data, { where: { dept_id } });
  }

  async delete(deptId: number) {
    return this.sysDeptModel.update(
      { del_flag: '2' },
      { where: { dept_id: deptId } },
    );
  }
}

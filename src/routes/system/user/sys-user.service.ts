import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@/databases/mysql-database/model/user.model';
import { Role } from '@/databases/mysql-database/model/role.model';
import { Dept } from '@/databases/mysql-database/model/dept.model';
import { UxPasswordService } from '@/modules/ux-password/ux-password.service';
import { UserDept } from '@/databases/mysql-database/model/user-dept.model';
import { UserRole } from '@/databases/mysql-database/model/user-role.model';
import { Op } from 'sequelize';
import { filterObjNull } from '@/tools';
import { Sequelize } from 'sequelize-typescript';

import {
  ListUserDto,
  CreateUserDto,
  UpdateUserDto,
  ResetPwdDto,
  ChangeStatusDto,
} from './dto/sys-user.dto';

/**
 * 系统-用户服务
 *
 * 提供用户管理相关业务能力（分页查询、详情、创建、更新、逻辑删除、重置密码、状态变更等）。
 *
 * @export
 * @class SysUserService
 * @typedef {SysUserService}
 */
@Injectable()
export class SysUserService {
  /**
   * 构造函数
   *
   * @param {typeof User} sysUserModel 用户模型
   * @param {typeof Role} sysRoleModel 角色模型
   * @param {UxPasswordService} uxPasswordService 密码能力服务
   */
  constructor(
    @InjectModel(User)
    private readonly sysUserModel: typeof User,
    @InjectModel(Role)
    private readonly sysRoleModel: typeof Role,
    @InjectModel(UserDept)
    private readonly sysUserDeptModel: typeof UserDept,
    @InjectModel(UserRole)
    private readonly sysUserRoleModel: typeof UserRole,
    private readonly uxPasswordService: UxPasswordService,
    private sequelize: Sequelize,
  ) {}

  /**
   * 用户分页列表查询
   *
   * @async
   * @param {ListUserDto} query 查询参数
   * @returns {Promise<{ rows: User[]; total: number }>} 分页结果
   */
  async findAll(query: ListUserDto) {
    const {
      pageNum = 1,
      pageSize = 20,
      user_name,
      phonenumber,
      status,
      dept_id,
    } = query;

    const where: any = { del_flag: '0' };
    if (user_name) where.user_name = { [Op.like]: `%${user_name}%` };
    if (phonenumber) where.phonenumber = { [Op.like]: `%${phonenumber}%` };
    if (status) where.status = status;
    if (dept_id) where.dept_id = dept_id;

    const { rows, count } = await this.sysUserModel.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      offset: (pageNum - 1) * pageSize,
      limit: +pageSize,
      include: [
        { model: Dept, as: 'dept', attributes: ['dept_name', 'leader'] },
      ],
    });

    return { rows, total: count };
  }

  /**
   * 获取所有用户列表（不分页）
   *
   * @async
   * @returns {Promise<User[]>} 用户列表
   */
  async findAllData() {
    return this.sysUserModel.findAll({
      where: { del_flag: '0' },
      attributes: { exclude: ['password'] },
      include: [
        { model: Dept, as: 'dept', attributes: ['dept_name', 'leader'] },
      ],
    });
  }

  /**
   * 获取用户详情
   *
   * @async
   * @param {number} userId 用户ID
   * @returns {Promise<{ data: User | null }>} 用户详情
   */
  async findOne(userId: number) {
    const user = await this.sysUserModel.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Dept, as: 'dept' },
        { model: Role },
        { model: Dept, as: 'depts' },
      ],
    });
    // TODO: 获取所有角色和岗位以标记为选中
    return { data: user };
  }

  /**
   * 创建用户
   *
   * 如传入 password，会在写入前进行加密处理。
   *
   * @async
   * @param {CreateUserDto} createUserDto 创建参数
   * @returns {Promise<User>} 创建后的用户记录
   */
  async create(createUserDto: CreateUserDto) {
    // 校验用户名唯一性
    const existUser = await this.sysUserModel.findOne({
      where: { user_name: createUserDto.user_name, del_flag: '0' },
    });
    if (existUser) {
      throw new HttpException(
        `用户账号 '${createUserDto.user_name}' 已存在`,
        HttpStatus.CONFLICT,
      );
    }

    // 加密密码
    if (createUserDto.password) {
      createUserDto.password = this.uxPasswordService.encryptedPassword(
        createUserDto.password,
      );
    }
    const { role_ids, dept_ids } = createUserDto;
    // console.log('createUserDto', createUserDto);
    return this.sysUserModel.create(createUserDto as any);
  }
  /**
   * 创建用户与角色关联
   *
   * @async
   * @param {number} user_id
   * @param {CreateUserDto} createUserDto
   * @returns {unknown}
   */
  async createByRoleIds(user_id: number, createUserDto: CreateUserDto) {
    const { role_ids } = createUserDto;
    if (!role_ids?.length) return false;
    const transaction = await this.sequelize.transaction();
    try {
      await this.sysUserRoleModel.destroy({
        where: {
          user_id,
        },
        transaction,
      });
      const roleData = role_ids.map((role_id) => ({
        user_id,
        role_id,
      }));
      // @ts-ignore
      await this.sysUserRoleModel.bulkCreate(roleData, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  /**
   * 创建用户与部门关联
   *
   * @async
   * @param {number} user_id
   * @param {CreateUserDto} createUserDto
   * @returns {unknown}
   */
  async createByDeptIds(user_id: number, createUserDto: CreateUserDto) {
    const { dept_ids } = createUserDto;
    if (!dept_ids?.length) return false;
    const transaction = await this.sequelize.transaction();
    try {
      await this.sysUserDeptModel.destroy({
        where: {
          user_id,
        },
        transaction,
      });
      const deptData = dept_ids.map((dept_id) => ({
        user_id,
        dept_id,
      }));
      // @ts-ignore
      await this.sysUserDeptModel.bulkCreate(deptData, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  /**
   * 更新用户
   *
   * 注意：该接口不用于更新密码（如传入 password 会被忽略），密码更新请走独立接口。
   *
   * @async
   * @param {UpdateUserDto} updateUserDto 更新参数
   * @returns {Promise<[number, User[]]>} Sequelize 更新结果
   */
  async update(updateUserDto: UpdateUserDto) {
    const { user_id, dept_ids, ...data } = updateUserDto;
    // 校验用户名唯一性（排除自身）
    if (data.user_name) {
      const existUser = await this.sysUserModel.findOne({
        where: {
          user_name: data.user_name,
          del_flag: '0',
          user_id: { [Op.ne]: user_id },
        },
      });
      if (existUser) {
        throw new HttpException(
          `用户账号 '${data.user_name}' 已存在`,
          HttpStatus.CONFLICT,
        );
      }
    }

    const result = await this.sysUserModel.update(data, { where: { user_id } });
    if (dept_ids) {
      const user = await this.sysUserModel.findByPk(user_id);
      if (user) {
        await user.$set('depts', dept_ids);
      }
    }
    return result;
  }

  /**
   * 逻辑删除用户
   *
   * @async
   * @param {string} userIds 用户ID列表（逗号分隔）
   * @returns {Promise<[number, User[]]>} Sequelize 更新结果
   */
  async delete(userIds: string) {
    return this.sysUserModel.update(
      { del_flag: '2' },
      { where: { user_id: userIds } },
    );
  }

  /**
   * 重置用户密码
   *
   * @async
   * @param {ResetPwdDto} body 重置参数
   * @returns {Promise<[number, User[]]>} Sequelize 更新结果
   */
  async resetPwd(body: ResetPwdDto) {
    const { user_id, password } = body;
    const hashedPassword = this.uxPasswordService.encryptedPassword(password);
    return this.sysUserModel.update(
      { password: hashedPassword, pwd_update_date: new Date() },
      { where: { user_id } },
    );
  }

  /**
   * 修改用户状态
   *
   * @async
   * @param {ChangeStatusDto} body 状态变更参数
   * @returns {Promise<[number, User[]]>} Sequelize 更新结果
   */
  async changeStatus(body: ChangeStatusDto) {
    const { user_id, status } = body;
    return this.sysUserModel.update({ status }, { where: { user_id } });
  }

  /**
   * 按用户名查询用户
   *
   * @async
   * @param {string} userName 用户名
   * @returns {Promise<User | null>} 用户记录（包含角色关联）
   */
  async findByUserName(userName: string) {
    return this.sysUserModel.findOne({
      where: { user_name: userName, del_flag: '0' },
      include: [{ model: Role }],
    });
  }
}

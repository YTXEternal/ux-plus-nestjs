import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysUser } from '@/databases/mysql-database/model/sys-user.model';
import { SysRole } from '@/databases/mysql-database/model/sys-role.model';
import { SysDept } from '@/databases/mysql-database/model/sys-dept.model';
import { UxPasswordService } from '@/modules/ux-password/ux-password.service';
import { Op } from 'sequelize';

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
   * @param {typeof SysUser} sysUserModel 用户模型
   * @param {typeof SysRole} sysRoleModel 角色模型
   * @param {typeof SysPost} sysPostModel 岗位模型
   * @param {UxPasswordService} uxPasswordService 密码能力服务
   */
  constructor(
    @InjectModel(SysUser)
    private readonly sysUserModel: typeof SysUser,
    @InjectModel(SysRole)
    private readonly sysRoleModel: typeof SysRole,
    private readonly uxPasswordService: UxPasswordService,
  ) {}

  /**
   * 用户分页列表查询
   *
   * @async
   * @param {ListUserDto} query 查询参数
   * @returns {Promise<{ rows: SysUser[]; total: number }>} 分页结果
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
        { model: SysDept, as: 'dept', attributes: ['dept_name', 'leader'] },
      ],
    });

    return { rows, total: count };
  }

  /**
   * 获取用户详情
   *
   * @async
   * @param {number} userId 用户ID
   * @returns {Promise<{ data: SysUser | null }>} 用户详情
   */
  async findOne(userId: number) {
    const user = await this.sysUserModel.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: SysDept, as: 'dept' },
        { model: SysRole },
        { model: SysDept, as: 'depts' },
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
   * @returns {Promise<SysUser>} 创建后的用户记录
   */
  async create(createUserDto: CreateUserDto) {
    // 加密密码
    if (createUserDto.password) {
      createUserDto.password = this.uxPasswordService.encryptedPassword(
        createUserDto.password,
      );
    }
    console.log('createUserDto', createUserDto);
    return this.sysUserModel.create(createUserDto as any);
  }

  /**
   * 更新用户
   *
   * 注意：该接口不用于更新密码（如传入 password 会被忽略），密码更新请走独立接口。
   *
   * @async
   * @param {UpdateUserDto} updateUserDto 更新参数
   * @returns {Promise<[number, SysUser[]]>} Sequelize 更新结果
   */
  async update(updateUserDto: UpdateUserDto) {
    const { user_id, dept_ids, ...data } = updateUserDto;
    // 通常不在这里更新密码，使用单独的 API
    if (data.password) delete data.password;
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
   * @returns {Promise<[number, SysUser[]]>} Sequelize 更新结果
   */
  async delete(userIds: string) {
    const ids = userIds.split(',');
    return this.sysUserModel.update(
      { del_flag: '2' },
      { where: { user_id: ids } },
    );
  }

  /**
   * 重置用户密码
   *
   * @async
   * @param {ResetPwdDto} body 重置参数
   * @returns {Promise<[number, SysUser[]]>} Sequelize 更新结果
   */
  async resetPwd(body: ResetPwdDto) {
    const { user_id, password } = body;
    const hashedPassword = this.uxPasswordService.encryptedPassword(password);
    return this.sysUserModel.update(
      { password: hashedPassword },
      { where: { user_id } },
    );
  }

  /**
   * 修改用户状态
   *
   * @async
   * @param {ChangeStatusDto} body 状态变更参数
   * @returns {Promise<[number, SysUser[]]>} Sequelize 更新结果
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
   * @returns {Promise<SysUser | null>} 用户记录（包含角色关联）
   */
  async findByUserName(userName: string) {
    return this.sysUserModel.findOne({
      where: { user_name: userName, del_flag: '0' },
      include: [{ model: SysRole }],
    });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysUser } from '@/databases/mysql-database/model/sys-user.model';
import { SysRole } from '@/databases/mysql-database/model/sys-role.model';
import { SysPost } from '@/databases/mysql-database/model/sys-post.model';
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

@Injectable()
export class SysUserService {
  constructor(
    @InjectModel(SysUser)
    private readonly sysUserModel: typeof SysUser,
    @InjectModel(SysRole)
    private readonly sysRoleModel: typeof SysRole,
    @InjectModel(SysPost)
    private readonly sysPostModel: typeof SysPost,
    private readonly uxPasswordService: UxPasswordService,
  ) {}

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
      offset: (pageNum - 1) * pageSize,
      limit: +pageSize,
      include: [{ model: SysDept, attributes: ['dept_name', 'leader'] }],
    });

    return { rows, total: count };
  }

  async findOne(userId: number) {
    const user = await this.sysUserModel.findByPk(userId, {
      include: [{ model: SysDept }, { model: SysRole }, { model: SysPost }],
    });
    // TODO: 获取所有角色和岗位以标记为选中
    return { data: user };
  }

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

  async update(updateUserDto: UpdateUserDto) {
    const { user_id, ...data } = updateUserDto;
    // 通常不在这里更新密码，使用单独的 API
    if (data.password) delete data.password;
    return this.sysUserModel.update(data, { where: { user_id } });
  }

  async delete(userIds: string) {
    const ids = userIds.split(',');
    return this.sysUserModel.update(
      { del_flag: '2' },
      { where: { user_id: ids } },
    );
  }

  async resetPwd(body: ResetPwdDto) {
    const { user_id, password } = body;
    const hashedPassword = this.uxPasswordService.encryptedPassword(password);
    return this.sysUserModel.update(
      { password: hashedPassword },
      { where: { user_id } },
    );
  }

  async changeStatus(body: ChangeStatusDto) {
    const { user_id, status } = body;
    return this.sysUserModel.update({ status }, { where: { user_id } });
  }

  async findByUserName(userName: string) {
    return this.sysUserModel.findOne({
      where: { user_name: userName, del_flag: '0' },
      include: [{ model: SysRole }],
    });
  }
}

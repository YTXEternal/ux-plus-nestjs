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
      pageSize = 10,
      userName,
      phonenumber,
      status,
      deptId,
    } = query;

    // @ts-ignore
    const where: any = { del_flag: '0' };
    if (userName) where.user_name = { [Op.like]: `%${userName}%` };
    if (phonenumber) where.phonenumber = { [Op.like]: `%${phonenumber}%` };
    if (status) where.status = status;
    if (deptId) where.dept_id = deptId;

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
    // TODO: Get all roles and posts to mark checked
    return { data: user };
  }

  async create(createUserDto: CreateUserDto) {
    // Encrypt password
    if (createUserDto.password) {
      createUserDto.password = this.uxPasswordService.encryptedPassword(
        createUserDto.password,
      );
    }
    return this.sysUserModel.create(createUserDto as any);
  }

  async update(updateUserDto: UpdateUserDto) {
    const { user_id, ...data } = updateUserDto;
    // Don't update password here usually, separate API
    if (data.password) delete data.password;
    return this.sysUserModel.update(data, { where: { user_id } });
  }

  async delete(userIds: string) {
    const ids = userIds.split(',');
    return this.sysUserModel.update(
      // @ts-ignore
      { del_flag: '2' },
      { where: { user_id: ids } },
    );
  }

  async resetPwd(body: ResetPwdDto) {
    const { user_id, password } = body;
    const hashedPassword = this.uxPasswordService.encryptedPassword(
      password || '',
    );
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

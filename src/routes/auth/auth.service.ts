import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysUser } from '@/databases/mysql-database/model/sys-user.model';
import { SysRole } from '@/databases/mysql-database/model/sys-role.model';
import { UxPasswordService } from '@/modules/ux-password/ux-password.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(SysUser)
    private readonly sysUserModel: typeof SysUser,
    private readonly uxPasswordService: UxPasswordService,
  ) {}

  /**
   * validate account and password
   *
   * @async
   * @param {string} user_name
   * @param {string} enPassword
   * @returns {any}
   */
  async validateCredentials(user_name: string, enPassword: string) {
    const user = await this.sysUserModel.findOne({
      where: { user_name: user_name, del_flag: '0' },
      include: [{ model: SysRole }],
    });
    if (!user) {
      throw new HttpException('Account does not exist', HttpStatus.BAD_REQUEST);
    }

    let isPass = false;
    try {
      isPass = this.uxPasswordService.verifyPassword(user.password, enPassword);
    } catch (e) {
      console.error('Password verification error:', e);
    }

    if (!isPass) {
      throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);
    }

    if (user.status === '1') {
      throw new HttpException('Account is disabled', HttpStatus.FORBIDDEN);
    }

    return user;
  }
}

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SysUserService } from '@/routes/system/user/sys-user.service';
import { UpdateUserProfileDto } from './dto/user_center.dto';
import { SysUser } from '@/databases/mysql-database/model/sys-user.model';

@Injectable()
export class UserCenterService {
  constructor(private readonly sysUserService: SysUserService) {}

  async getProfile(userId: number): Promise<Partial<SysUser>> {
    const { data: user } = await this.sysUserService.findOne(userId);
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }

    // 只返回指定的字段
    return {
      nick_name: user.nick_name,
      email: user.email,
      phonenumber: user.phonenumber,
      sex: user.sex,
      avatar: user.avatar,
    };
  }

  async updateProfile(
    userId: number,
    dto: UpdateUserProfileDto,
  ): Promise<void> {
    const { data: currentInfo } = await this.sysUserService.findOne(userId);
    if (!currentInfo) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }

    // 我们不能直接使用 SysUserService.update，因为它需要很多参数
    // 这里我们直接更新允许更新的字段
    await currentInfo.update({
      nick_name: dto.nick_name ?? currentInfo.nick_name,
      email: dto.email ?? currentInfo.email,
      phonenumber: dto.phonenumber ?? currentInfo.phonenumber,
      sex: dto.sex ?? currentInfo.sex,
      avatar: dto.avatar ?? currentInfo.avatar,
    });
  }
}

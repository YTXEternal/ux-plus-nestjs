import { Module } from '@nestjs/common';
import { UserCenterService } from './user_center.service';
import { UserCenterController } from './user_center.controller';
import { SysUserModule } from '@/routes/system/user/sys-user.module';

@Module({
  imports: [SysUserModule],
  controllers: [UserCenterController],
  providers: [UserCenterService],
})
export class UserCenterModule {}

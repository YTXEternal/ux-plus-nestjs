import { Expose, Transform } from 'class-transformer';
import { SysUserInter } from '@/databases/mysql-database/interfaces/sys-user.interface';
export class Info {
  @Expose()
  roles: string[];
  @Expose()
  permissions: string[];

  @Expose({ name: 'user' })
  @Transform(({ obj }: { obj: { user: SysUserInter } }) => obj.user.user_id)
  userId: string;
  @Expose({ name: 'user' })
  @Transform(({ obj }: { obj: { user: SysUserInter } }) => obj.user.user_name)
  username: string;
  @Expose({ name: 'user' })
  @Transform(({ obj }: { obj: { user: SysUserInter } }) => obj.user.user_name)
  realName: string;

  @Expose()
  desc: string;
}

import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiResponse } from '@/dto/api-response';

export class AuthLoginDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsString()
  @IsNotEmpty({ message: 'Account cannot be empty' })
  user_name: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: '访问令牌' })
  token: string;

  @ApiProperty({ description: '刷新令牌' })
  refreshToken: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: '刷新令牌',
    example: 'Bearer <your token>',
  })
  @IsString()
  @IsNotEmpty({ message: 'Refresh token cannot be empty' })
  refreshToken: string;
}

export class UserResponseDto {
  @ApiProperty({ description: '用户ID', example: 1 })
  user_id: number;

  @ApiProperty({ description: '部门ID', example: 103 })
  dept_id: number;

  @ApiProperty({ description: '用户账号', example: 'admin' })
  user_name: string;

  @ApiProperty({ description: '用户昵称', example: '若依' })
  nick_name: string;

  @ApiProperty({ description: '用户邮箱', example: 'ry@qq.com' })
  email: string;

  @ApiProperty({ description: '手机号码', example: '15888888888' })
  phonenumber: string;

  @ApiProperty({ description: '用户性别', example: '0' })
  sex: string;

  @ApiProperty({ description: '头像地址', example: '' })
  avatar: string;

  @ApiProperty({ description: '帐号状态（0正常 1停用）', example: '0' })
  status: string;

  @ApiProperty({ description: '最后登录IP', example: '127.0.0.1' })
  login_ip: string;

  @ApiProperty({
    description: '最后登录时间',
    example: '2023-01-01T00:00:00.000Z',
  })
  login_date: Date;

  @ApiProperty({ description: '创建时间', example: '2023-01-01T00:00:00.000Z' })
  create_time: Date;

  @ApiPropertyOptional({ description: '备注' })
  remark?: string;
}

export class UserInfoResponseDto {
  @ApiProperty({ description: '用户信息', type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ description: '角色标识列表', example: ['admin'] })
  roles: string[];

  @ApiProperty({ description: '权限标识列表', example: ['system:user:list'] })
  permissions: string[];
}

export class RouterResponseDto {
  @ApiProperty({ description: '菜单ID', example: 1 })
  menu_id: number;

  @ApiProperty({ description: '菜单名称', example: '系统管理' })
  menu_name: string;

  @ApiProperty({ description: '父菜单ID', example: 0 })
  parent_id: number;

  @ApiProperty({ description: '显示顺序', example: 1 })
  order_num: number;

  @ApiProperty({ description: '路由地址', example: 'system' })
  path: string;

  @ApiProperty({ description: '组件路径', example: 'Layout' })
  component: string;

  @ApiProperty({ description: '路由参数', example: '' })
  query: string;

  @ApiProperty({ description: '是否为外链（0是 1否）', example: 1 })
  is_frame: number;

  @ApiProperty({ description: '是否缓存（0缓存 1不缓存）', example: 0 })
  is_cache: number;

  @ApiProperty({ description: '菜单类型（M目录 C菜单 F按钮）', example: 'M' })
  menu_type: string;

  @ApiProperty({ description: '显示状态（0显示 1隐藏）', example: '0' })
  visible: string;

  @ApiProperty({ description: '菜单状态（0正常 1停用）', example: '0' })
  status: string;

  @ApiProperty({ description: '权限标识', example: '' })
  perms: string;

  @ApiProperty({ description: '菜单图标', example: 'system' })
  icon: string;

  @ApiProperty({ description: '创建者', example: 'admin' })
  create_by: string;

  @ApiProperty({ description: '创建时间', example: '2023-01-01T00:00:00.000Z' })
  create_time: Date;

  @ApiProperty({ description: '更新者', example: '' })
  update_by: string;

  @ApiProperty({ description: '更新时间', example: '2023-01-01T00:00:00.000Z' })
  update_time: Date;

  @ApiProperty({ description: '备注', example: '系统管理目录' })
  remark: string;

  @ApiPropertyOptional({ description: '子菜单', type: [RouterResponseDto] })
  children?: RouterResponseDto[];
}

export class LoginResult extends ApiResponse<LoginResponseDto> {
  @ApiProperty({ type: LoginResponseDto })
  data: LoginResponseDto;
}

export class RefreshTokenResult extends ApiResponse<LoginResponseDto> {
  @ApiProperty({ type: LoginResponseDto })
  data: LoginResponseDto;
}

export class UserInfoResult extends ApiResponse<UserInfoResponseDto> {
  @ApiProperty({ type: UserInfoResponseDto })
  data: UserInfoResponseDto;
}

export class RouterResult extends ApiResponse<RouterResponseDto[]> {
  @ApiProperty({ type: [RouterResponseDto] })
  data: RouterResponseDto[];
}

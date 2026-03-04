import {
  IsString,
  IsOptional,
  IsNumber,
  IsEmail,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListUserDto {
  @ApiPropertyOptional({ description: '页码', example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageNum?: number;

  @ApiPropertyOptional({ description: '每页数量', example: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize?: number;

  @ApiPropertyOptional({ description: '用户名', example: 'admin' })
  @IsOptional()
  @IsString()
  user_name?: string;

  @ApiPropertyOptional({ description: '手机号码', example: '15888888888' })
  @IsOptional()
  @IsString()
  phonenumber?: string;

  @ApiPropertyOptional({ description: '状态', example: '0' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: '部门ID', example: 100 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  dept_id?: number;
}

export class GetUserParamDto {
  @ApiProperty({ description: '用户ID', example: 1 })
  @IsNumber()
  @Type(() => Number)
  userId: number;
}

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'test' })
  @IsString()
  user_name: string;

  @ApiProperty({ description: '昵称', example: 'Test User' })
  @IsString()
  nick_name: string;

  @ApiPropertyOptional({ description: '密码', example: '123456' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ description: '部门ID', example: 100 })
  @IsOptional()
  @IsNumber()
  dept_id?: number;

  @ApiPropertyOptional({ description: '手机号码', example: '15888888888' })
  @IsOptional()
  @IsString()
  phonenumber?: string;

  @ApiPropertyOptional({ description: '邮箱', example: 'ry@qq.com' })
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: '性别', example: '0' })
  @IsOptional()
  @IsString()
  sex?: string;

  @ApiPropertyOptional({ description: '状态', example: '0' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: '备注', example: '管理员' })
  @IsOptional()
  @IsString()
  remark?: string;

  @ApiPropertyOptional({ description: '角色ID列表', example: [1] })
  @IsOptional()
  @IsArray()
  role_ids?: number[];

  @ApiPropertyOptional({ description: '部门ID列表', example: [100] })
  @IsOptional()
  @IsArray()
  dept_ids?: number[];
}

export class UpdateUserDto {
  @ApiProperty({ description: '用户ID', example: 1 })
  @IsNumber()
  user_id: number;

  @ApiProperty({ description: '用户名', example: 'test' })
  @IsString()
  user_name: string;

  @ApiProperty({ description: '昵称', example: 'Test User' })
  @IsString()
  nick_name: string;

  @ApiPropertyOptional({ description: '部门ID', example: 100 })
  @IsOptional()
  @IsNumber()
  dept_id?: number;

  @ApiPropertyOptional({ description: '手机号码', example: '15888888888' })
  @IsOptional()
  @IsString()
  phonenumber?: string;

  @ApiPropertyOptional({ description: '邮箱', example: 'ry@qq.com' })
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: '性别', example: '0' })
  @IsOptional()
  @IsString()
  sex?: string;

  @ApiPropertyOptional({ description: '状态', example: '0' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: '备注', example: '管理员' })
  @IsOptional()
  @IsString()
  remark?: string;

  @ApiPropertyOptional({ description: '角色ID列表', example: [1] })
  @IsOptional()
  @IsArray()
  role_ids?: number[];

  @ApiPropertyOptional({ description: '部门ID列表', example: [100] })
  @IsOptional()
  @IsArray()
  dept_ids?: number[];
}

export class ResetPwdDto {
  @ApiProperty({ description: '用户ID', example: 1 })
  @IsNumber()
  user_id: number;

  @ApiProperty({ description: '新密码', example: '123456' })
  @IsString()
  password: string;
}

export class ChangeStatusDto {
  @ApiProperty({ description: '用户ID', example: 1 })
  @IsNumber()
  user_id: number;

  @ApiProperty({ description: '状态', example: '0' })
  @IsString()
  status: string;
}

export class DeleteUserDto {
  @ApiProperty({ description: '用户ID列表', example: [1, 2] })
  @IsArray()
  user_ids: number[];
}

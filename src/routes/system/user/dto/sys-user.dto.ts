import {
  IsString,
  IsOptional,
  IsNumber,
  IsEmail,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ListUserDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageNum?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize?: number;

  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  phonenumber?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  deptId?: number;
}

export class CreateUserDto {
  @IsString()
  userName: string;

  @IsString()
  nickName: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsNumber()
  deptId?: number;

  @IsOptional()
  @IsString()
  phonenumber?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  sex?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @IsArray()
  postIds?: number[];

  @IsOptional()
  @IsArray()
  roleIds?: number[];
}

export class UpdateUserDto extends CreateUserDto {
  @IsNumber()
  user_id: number;
}

export class ResetPwdDto {
  @IsNumber()
  user_id: number;

  @IsString()
  password?: string;
}

export class ChangeStatusDto {
  @IsNumber()
  user_id: number;

  @IsString()
  status: string;
}

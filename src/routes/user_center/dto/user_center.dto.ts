import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdateUserProfileDto {
  @ApiPropertyOptional({ description: '用户昵称' })
  @IsOptional()
  @IsString({ message: '用户昵称必须是字符串' })
  @Length(1, 30, { message: '用户昵称长度必须在1到30个字符之间' })
  nick_name?: string;

  @ApiPropertyOptional({ description: '用户邮箱' })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @ApiPropertyOptional({ description: '手机号码' })
  @IsOptional()
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号码格式不正确' })
  phonenumber?: string;

  @ApiPropertyOptional({ description: '用户性别（0男 1女 2未知）' })
  @IsOptional()
  @IsString({ message: '性别必须是字符串' })
  @Length(1, 1, { message: '性别长度必须是1个字符' })
  sex?: string;

  @ApiPropertyOptional({ description: '头像地址' })
  @IsOptional()
  @IsString({ message: '头像地址必须是字符串' })
  avatar?: string;
}

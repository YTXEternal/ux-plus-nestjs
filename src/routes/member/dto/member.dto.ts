import {
  IsString,
  IsOptional,
  IsNumber,
  IsEmail,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateMemberDto {
  @ApiProperty({ description: '会员姓名', example: '张三' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: '联系电话', example: '13800138000' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: '邮箱', example: 'zhangsan@example.com' })
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;
}

export class UpdateMemberDto extends CreateMemberDto {
  @ApiProperty({ description: '会员ID', example: 1 })
  @IsNumber()
  member_id: number;
}

export class DeleteMemberDto {
  @ApiProperty({ description: '会员ID列表', example: [1, 2] })
  @IsArray()
  member_ids: number[];
}

export class ListMemberDto {
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

  @ApiPropertyOptional({ description: '会员姓名', example: '张三' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '联系电话', example: '13800138000' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: '邮箱', example: 'zhangsan@example.com' })
  @IsOptional()
  @IsString()
  email?: string;
}

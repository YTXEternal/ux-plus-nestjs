import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListLogininforDto {
  @ApiPropertyOptional({ description: '页码' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageNum?: number;

  @ApiPropertyOptional({ description: '每页数量' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize?: number;

  @ApiPropertyOptional({ description: '登录IP地址' })
  @IsOptional()
  @IsString()
  ipaddr?: string;

  @ApiPropertyOptional({ description: '用户名' })
  @IsOptional()
  @IsString()
  user_name?: string;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class DeleteLogininforDto {
  @ApiProperty({ description: '访问ID列表' })
  @IsArray()
  info_ids: number[];
}

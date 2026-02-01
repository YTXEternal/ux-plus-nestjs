import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListOnlineDto {
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
}

export class ForceLogoutDto {
  @ApiProperty({ description: 'Token ID' })
  @IsString()
  token_id: string;
}

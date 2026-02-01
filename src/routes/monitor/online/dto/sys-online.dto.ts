import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListOnlineDto {
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

  @ApiPropertyOptional({ description: '登录IP地址', example: '127.0.0.1' })
  @IsOptional()
  @IsString()
  ipaddr?: string;

  @ApiPropertyOptional({ description: '用户名', example: 'admin' })
  @IsOptional()
  @IsString()
  user_name?: string;
}

export class ForceLogoutDto {
  @ApiProperty({ description: 'Token ID', example: 'uuid-token' })
  @IsString()
  token_id: string;
}

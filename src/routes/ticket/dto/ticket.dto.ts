import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketDto {
  @ApiProperty({ description: '会员ID', example: 1 })
  @IsNumber()
  member_id: number;

  @ApiProperty({ description: '排场ID', example: 1 })
  @IsNumber()
  arrange_id: number;

  @ApiProperty({ description: '购买张数', example: 1 })
  @IsNumber()
  count: number;
}

export class ListTicketDto {
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
}

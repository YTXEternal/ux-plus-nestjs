import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class RefundTicketDto {
  @ApiProperty({ description: '购票ID', example: 1 })
  @IsNumber()
  ticket_id: number;

  @ApiProperty({ description: '退款原因', example: '不想看了' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class ListTicketRecordDto {
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

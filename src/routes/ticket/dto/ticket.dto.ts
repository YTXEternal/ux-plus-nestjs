import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketDto {
  @ApiProperty({ description: '门店ID', example: 1 })
  @IsNumber()
  shop_id: number;

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
  @ApiProperty({ description: '门店ID', example: 1 })
  @IsNumber()
  @Type(() => Number)
  shop_id: number;

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

  @ApiPropertyOptional({
    description: '订单编号',
    example: 'TICKET20231010123456789',
  })
  @IsOptional()
  @IsString()
  order_no?: string;
}

export class DetailTicketDto {
  @ApiProperty({ description: '门店ID', example: 1 })
  @IsNumber()
  @Type(() => Number)
  shop_id: number;
}

export class TicketPayDto {
  @ApiProperty({ description: '购票ID', example: 1 })
  @IsNumber()
  ticket_id: number;

  @ApiProperty({ description: '门店ID', example: 1 })
  @IsNumber()
  shop_id: number;
}

export class TicketRefundDto {
  @ApiProperty({ description: '购票ID', example: 1 })
  @IsNumber()
  ticket_id: number;

  @ApiProperty({ description: '门店ID', example: 1 })
  @IsNumber()
  shop_id: number;
}

export class TicketPayStatusDto {
  @ApiProperty({ description: '购票ID', example: 1 })
  @IsNumber()
  @Type(() => Number)
  ticket_id: number;

  @ApiProperty({ description: '门店ID', example: 1 })
  @IsNumber()
  @Type(() => Number)
  shop_id: number;
}

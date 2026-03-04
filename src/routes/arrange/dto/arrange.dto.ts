import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateArrangeDto {
  @ApiProperty({ description: '排场名称', example: '周五晚场' })
  @IsString()
  name: string;

  @ApiProperty({ description: '剧本ID', example: 1 })
  @IsNumber()
  drama_id: number;

  @ApiProperty({ description: '门店ID', example: 1 })
  @IsNumber()
  shop_id: number;

  @ApiProperty({ description: '票价', example: 100.0 })
  @IsNumber()
  price: number;

  @ApiProperty({ description: '开始时间', example: '2023-10-01 19:00:00' })
  @IsDateString()
  start_time: Date;

  @ApiProperty({ description: '结束时间', example: '2023-10-01 22:00:00' })
  @IsDateString()
  end_time: Date;

  @ApiProperty({ description: '总票数', example: 50 })
  @IsNumber()
  total_tickets: number;

  @ApiProperty({ description: '剩余票数', example: 50 })
  @IsNumber()
  remaining_tickets: number;
}

export class UpdateArrangeDto extends CreateArrangeDto {
  @ApiProperty({ description: '排场ID', example: 1 })
  @IsNumber()
  arrange_id: number;
}

export class ListArrangeDto {
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

  @ApiPropertyOptional({ description: '排场名称', example: '晚场' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '门店ID', example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  shop_id?: number;

  @ApiPropertyOptional({
    description: '开场状态(0所有，1已开场，2未开场)',
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  status?: number;
}

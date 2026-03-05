import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateDramaDto {
  @ApiProperty({ description: '剧本名称', example: '恐怖游轮' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: '剧本描述', example: '这是一个恐怖剧本' })
  @IsOptional()
  @IsString()
  desc?: string;

  @ApiPropertyOptional({ description: '关联门店ID列表', example: [1, 2] })
  @IsOptional()
  @IsArray()
  shop_ids?: number[];

  @ApiPropertyOptional({ description: '关联标签ID列表', example: [1, 2] })
  @IsOptional()
  @IsArray()
  label_ids?: number[];
}

export class UpdateDramaDto extends CreateDramaDto {
  @ApiProperty({ description: '剧本ID', example: 1 })
  @IsNumber()
  event_id: number;
}

export class DeleteDramaDto {
  @ApiProperty({ description: '剧本ID列表', example: [1, 2] })
  @IsArray()
  event_ids: number[];
}

export class UpdateDramaStatusDto {
  @ApiProperty({ description: '剧本ID', example: 1 })
  @IsNumber()
  event_id: number;

  @ApiProperty({ description: '状态（0启用 1停用）', example: '0' })
  @IsString()
  @IsEnum(['0', '1'])
  status: string;
}

export class ListDramaDto {
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

  @ApiPropertyOptional({ description: '剧本名称', example: '恐怖' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: '删除标志(0正常，2已删除)',
    example: '0',
  })
  @IsOptional()
  @IsString()
  del_flag?: string;

  @ApiPropertyOptional({ description: '状态(0启用，1停用)', example: '0' })
  @IsOptional()
  @IsString()
  status?: string;
}

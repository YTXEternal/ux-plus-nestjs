import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateLabelDto {
  @ApiProperty({ description: '标签名称', example: '新品' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: '状态（0正常 1停用）', example: '0' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateLabelDto extends CreateLabelDto {
  @ApiProperty({ description: '标签ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  label_id: number;
}

export class DeleteLabelDto {
  @ApiProperty({ description: '标签ID列表', example: [1, 2] })
  @IsArray()
  @IsNotEmpty()
  label_ids: number[];
}

export class ChangeStatusLabelDto {
  @ApiProperty({ description: '标签ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  label_id: number;

  @ApiProperty({ description: '状态（0正常 1停用）', example: '0' })
  @IsString()
  @IsNotEmpty()
  status: string;
}

export class ListLabelDto {
  @ApiPropertyOptional({ description: '页码', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageNum?: number;

  @ApiPropertyOptional({ description: '每页数量', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number;

  @ApiPropertyOptional({ description: '标签名称（模糊搜索）', example: '新' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '状态（0正常 1停用）', example: '0' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: '删除标志（0正常 2删除）', example: '0' })
  @IsOptional()
  @IsString()
  del_flag?: string;
}

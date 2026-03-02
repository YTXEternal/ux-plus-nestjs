import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class ListFileDto {
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

  @ApiPropertyOptional({ description: '文件名称', example: 'example.png' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '文件类型', example: 'image/png' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: '删除标志', example: '0' })
  @IsOptional()
  @IsString()
  del_flag?: string;
}

export class DeleteFileDto {
  @ApiProperty({ description: '文件ID列表', example: [1, 2] })
  @IsArray()
  @IsNumber({}, { each: true })
  file_ids: number[] = [];
}

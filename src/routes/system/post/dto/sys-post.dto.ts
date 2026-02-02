import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListPostDto {
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

  @ApiPropertyOptional({ description: '岗位编码', example: 'se' })
  @IsOptional()
  @IsString()
  post_code?: string;

  @ApiPropertyOptional({ description: '岗位名称', example: '软件工程师' })
  @IsOptional()
  @IsString()
  post_name?: string;

  @ApiPropertyOptional({ description: '状态', example: '0' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class GetPostParamDto {
  @ApiProperty({ description: '岗位ID', example: 1 })
  @IsNumber()
  @Type(() => Number)
  postId: number;
}

export class CreatePostDto {
  @ApiProperty({ description: '岗位编码', example: 'se' })
  @IsString()
  post_code: string;

  @ApiProperty({ description: '岗位名称', example: '软件工程师' })
  @IsString()
  post_name: string;

  @ApiProperty({ description: '显示顺序', example: 1 })
  @IsNumber()
  post_sort: number;

  @ApiProperty({ description: '状态', example: '0' })
  @IsString()
  status: string;

  @ApiPropertyOptional({ description: '备注', example: '负责软件开发' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdatePostDto extends CreatePostDto {
  @ApiProperty({ description: '岗位ID', example: 1 })
  @IsNumber()
  post_id: number;
}

export class DeletePostDto {
  @ApiProperty({ description: '岗位ID列表', example: [1] })
  @IsArray()
  post_ids: number[];
}

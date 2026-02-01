import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListPostDto {
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

  @ApiPropertyOptional({ description: '岗位编码' })
  @IsOptional()
  @IsString()
  post_code?: string;

  @ApiPropertyOptional({ description: '岗位名称' })
  @IsOptional()
  @IsString()
  post_name?: string;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class CreatePostDto {
  @ApiProperty({ description: '岗位编码' })
  @IsString()
  post_code: string;

  @ApiProperty({ description: '岗位名称' })
  @IsString()
  post_name: string;

  @ApiProperty({ description: '显示顺序' })
  @IsNumber()
  post_sort: number;

  @ApiProperty({ description: '状态' })
  @IsString()
  status: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdatePostDto extends CreatePostDto {
  @ApiProperty({ description: '岗位ID' })
  @IsNumber()
  post_id: number;
}

export class DeletePostDto {
  @ApiProperty({ description: '岗位ID列表' })
  @IsArray()
  post_ids: number[];
}

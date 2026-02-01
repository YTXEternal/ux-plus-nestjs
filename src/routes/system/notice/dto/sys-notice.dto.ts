import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListNoticeDto {
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

  @ApiPropertyOptional({ description: '公告标题' })
  @IsOptional()
  @IsString()
  notice_title?: string;

  @ApiPropertyOptional({ description: '公告类型' })
  @IsOptional()
  @IsString()
  notice_type?: string;

  @ApiPropertyOptional({ description: '创建者' })
  @IsOptional()
  @IsString()
  create_by?: string;
}

export class CreateNoticeDto {
  @ApiProperty({ description: '公告标题' })
  @IsString()
  notice_title: string;

  @ApiProperty({ description: '公告类型' })
  @IsString()
  notice_type: string;

  @ApiPropertyOptional({ description: '公告内容' })
  @IsOptional()
  @IsString()
  notice_content?: string;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateNoticeDto extends CreateNoticeDto {
  @ApiProperty({ description: '公告ID' })
  @IsNumber()
  notice_id: number;
}

export class DeleteNoticeDto {
  @ApiProperty({ description: '公告ID列表' })
  @IsArray()
  notice_ids: number[];
}

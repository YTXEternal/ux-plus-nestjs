import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListNoticeDto {
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

  @ApiPropertyOptional({ description: '公告标题', example: '系统通知' })
  @IsOptional()
  @IsString()
  notice_title?: string;

  @ApiPropertyOptional({ description: '公告类型', example: '1' })
  @IsOptional()
  @IsString()
  notice_type?: string;

  @ApiPropertyOptional({ description: '创建者', example: 'admin' })
  @IsOptional()
  @IsString()
  create_by?: string;
}

export class GetNoticeParamDto {
  @ApiProperty({ description: '公告ID', example: 1 })
  @IsNumber()
  @Type(() => Number)
  noticeId: number;
}

export class CreateNoticeDto {
  @ApiProperty({ description: '公告标题', example: '维护通知' })
  @IsString()
  notice_title: string;

  @ApiProperty({ description: '公告类型', example: '1' })
  @IsString()
  notice_type: string;

  @ApiPropertyOptional({ description: '公告内容', example: '系统将于今晚维护' })
  @IsOptional()
  @IsString()
  notice_content?: string;

  @ApiPropertyOptional({ description: '状态', example: '0' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateNoticeDto extends CreateNoticeDto {
  @ApiProperty({ description: '公告ID', example: 1 })
  @IsNumber()
  notice_id: number;
}

export class DeleteNoticeDto {
  @ApiProperty({ description: '公告ID列表', example: [1] })
  @IsArray()
  notice_ids: number[];
}

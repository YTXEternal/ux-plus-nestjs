import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ListNoticeDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageNum?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize?: number;

  @IsOptional()
  @IsString()
  noticeTitle?: string;

  @IsOptional()
  @IsString()
  noticeType?: string;

  @IsOptional()
  @IsString()
  createBy?: string;
}

export class CreateNoticeDto {
  @IsString()
  noticeTitle: string;

  @IsString()
  noticeType: string;

  @IsOptional()
  @IsString()
  noticeContent?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateNoticeDto extends CreateNoticeDto {
  @IsNumber()
  notice_id: number;
}

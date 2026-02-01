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
  notice_title?: string;

  @IsOptional()
  @IsString()
  notice_type?: string;

  @IsOptional()
  @IsString()
  create_by?: string;
}

export class CreateNoticeDto {
  @IsString()
  notice_title: string;

  @IsString()
  notice_type: string;

  @IsOptional()
  @IsString()
  notice_content?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateNoticeDto extends CreateNoticeDto {
  @IsNumber()
  notice_id: number;
}

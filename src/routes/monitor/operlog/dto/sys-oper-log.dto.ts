import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ListOperLogDto {
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
  title?: string;

  @IsOptional()
  @IsString()
  operName?: string;

  @IsOptional()
  @IsString()
  businessType?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

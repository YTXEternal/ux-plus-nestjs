import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ListLogininforDto {
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
  ipaddr?: string;

  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ListPostDto {
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
  post_code?: string;

  @IsOptional()
  @IsString()
  post_name?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class CreatePostDto {
  @IsString()
  post_code: string;

  @IsString()
  post_name: string;

  @IsNumber()
  post_sort: number;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdatePostDto extends CreatePostDto {
  @IsNumber()
  post_id: number;
}

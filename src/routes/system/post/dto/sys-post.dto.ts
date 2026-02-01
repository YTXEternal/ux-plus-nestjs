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
  postCode?: string;

  @IsOptional()
  @IsString()
  postName?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class CreatePostDto {
  @IsString()
  postCode: string;

  @IsString()
  postName: string;

  @IsNumber()
  postSort: number;

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

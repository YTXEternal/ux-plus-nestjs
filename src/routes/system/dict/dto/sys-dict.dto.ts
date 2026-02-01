import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

// Dict Type DTOs
export class ListDictTypeDto {
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
  dict_name?: string;

  @IsOptional()
  @IsString()
  dict_type?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateDictTypeDto {
  @IsString()
  dict_name: string;

  @IsString()
  dict_type: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateDictTypeDto extends CreateDictTypeDto {
  @IsNumber()
  dict_id: number;
}

// Dict Data DTOs
export class ListDictDataDto {
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
  dict_type?: string;

  @IsOptional()
  @IsString()
  dict_label?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateDictDataDto {
  @IsString()
  dict_type: string;

  @IsString()
  dict_label: string;

  @IsString()
  dict_value: string;

  @IsOptional()
  @IsString()
  css_class?: string;

  @IsOptional()
  @IsString()
  list_class?: string;

  @IsNumber()
  dict_sort: number;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateDictDataDto extends CreateDictDataDto {
  @IsNumber()
  dict_code: number;
}

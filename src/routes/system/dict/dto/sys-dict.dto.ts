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
  dictName?: string;

  @IsOptional()
  @IsString()
  dictType?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateDictTypeDto {
  @IsString()
  dictName: string;

  @IsString()
  dictType: string;

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
  dictType?: string;

  @IsOptional()
  @IsString()
  dictLabel?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateDictDataDto {
  @IsString()
  dictType: string;

  @IsString()
  dictLabel: string;

  @IsString()
  dictValue: string;

  @IsOptional()
  @IsString()
  cssClass?: string;

  @IsOptional()
  @IsString()
  listClass?: string;

  @IsNumber()
  dictSort: number;

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

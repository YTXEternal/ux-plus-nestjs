import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ListConfigDto {
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
  config_name?: string;

  @IsOptional()
  @IsString()
  config_key?: string;

  @IsOptional()
  @IsString()
  config_type?: string;
}

export class CreateConfigDto {
  @IsString()
  config_name: string;

  @IsString()
  config_key: string;

  @IsString()
  config_value: string;

  @IsOptional()
  @IsString()
  config_type?: string;

  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateConfigDto extends CreateConfigDto {
  @IsNumber()
  config_id: number;
}

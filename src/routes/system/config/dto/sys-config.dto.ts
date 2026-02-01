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
  configName?: string;

  @IsOptional()
  @IsString()
  configKey?: string;

  @IsOptional()
  @IsString()
  configType?: string;
}

export class CreateConfigDto {
  @IsString()
  configName: string;

  @IsString()
  configKey: string;

  @IsString()
  configValue: string;

  @IsOptional()
  @IsString()
  configType?: string;

  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateConfigDto extends CreateConfigDto {
  @IsNumber()
  config_id: number;
}

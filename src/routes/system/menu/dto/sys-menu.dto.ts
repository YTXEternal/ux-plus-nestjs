import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class ListMenuDto {
  @IsOptional()
  @IsString()
  menu_name?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateMenuDto {
  @IsOptional()
  @IsNumber()
  parent_id?: number;

  @IsString()
  menu_name: string;

  @IsNumber()
  order_num: number;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  component?: string;

  @IsOptional()
  @IsNumber()
  is_frame?: number;

  @IsOptional()
  @IsNumber()
  is_cache?: number;

  @IsString()
  menu_type: string;

  @IsOptional()
  @IsString()
  visible?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  perms?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  query?: string;
}

export class UpdateMenuDto extends CreateMenuDto {
  @IsNumber()
  menu_id: number;
}

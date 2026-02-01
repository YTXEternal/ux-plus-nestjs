import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class ListMenuDto {
  @IsOptional()
  @IsString()
  menuName?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateMenuDto {
  @IsOptional()
  @IsNumber()
  parentId?: number;

  @IsString()
  menuName: string;

  @IsNumber()
  orderNum: number;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  component?: string;

  @IsOptional()
  @IsNumber()
  isFrame?: number;

  @IsOptional()
  @IsNumber()
  isCache?: number;

  @IsString()
  menuType: string;

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

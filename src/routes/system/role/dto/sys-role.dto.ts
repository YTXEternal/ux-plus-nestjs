import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ListRoleDto {
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
  role_name?: string;

  @IsOptional()
  @IsString()
  role_key?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateRoleDto {
  @IsString()
  role_name: string;

  @IsString()
  role_key: string;

  @IsNumber()
  role_sort: number;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @IsArray()
  menu_ids?: number[];

  @IsOptional()
  @IsBoolean()
  menu_check_strictly?: boolean;

  @IsOptional()
  @IsBoolean()
  dept_check_strictly?: boolean;
}

export class UpdateRoleDto extends CreateRoleDto {
  @IsNumber()
  role_id: number;
}

export class ChangeRoleStatusDto {
  @IsNumber()
  role_id: number;

  @IsString()
  status: string;
}

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
  roleName?: string;

  @IsOptional()
  @IsString()
  roleKey?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateRoleDto {
  @IsString()
  roleName: string;

  @IsString()
  roleKey: string;

  @IsNumber()
  roleSort: number;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @IsArray()
  menuIds?: number[];

  @IsOptional()
  @IsBoolean()
  menuCheckStrictly?: boolean;

  @IsOptional()
  @IsBoolean()
  deptCheckStrictly?: boolean;
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

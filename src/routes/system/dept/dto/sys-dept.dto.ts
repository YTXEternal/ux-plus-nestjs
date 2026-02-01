import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ListDeptDto {
  @IsOptional()
  @IsString()
  dept_name?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateDeptDto {
  @IsOptional()
  @IsNumber()
  parent_id?: number;

  @IsString()
  dept_name: string;

  @IsNumber()
  order_num: number;

  @IsOptional()
  @IsString()
  leader?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateDeptDto extends CreateDeptDto {
  @IsNumber()
  dept_id: number;
}

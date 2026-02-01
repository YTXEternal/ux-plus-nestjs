import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ListDeptDto {
  @IsOptional()
  @IsString()
  deptName?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateDeptDto {
  @IsOptional()
  @IsNumber()
  parentId?: number;

  @IsString()
  deptName: string;

  @IsNumber()
  orderNum: number;

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

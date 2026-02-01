import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListDeptDto {
  @ApiPropertyOptional({ description: '部门名称' })
  @IsOptional()
  @IsString()
  dept_name?: string;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateDeptDto {
  @ApiPropertyOptional({ description: '父部门ID' })
  @IsOptional()
  @IsNumber()
  parent_id?: number;

  @ApiProperty({ description: '部门名称' })
  @IsString()
  dept_name: string;

  @ApiProperty({ description: '显示顺序' })
  @IsNumber()
  order_num: number;

  @ApiPropertyOptional({ description: '负责人' })
  @IsOptional()
  @IsString()
  leader?: string;

  @ApiPropertyOptional({ description: '联系电话' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateDeptDto extends CreateDeptDto {
  @ApiProperty({ description: '部门ID' })
  @IsNumber()
  dept_id: number;
}

export class DeleteDeptDto {
  @ApiProperty({ description: '部门ID' })
  @IsNumber()
  dept_id: number;
}

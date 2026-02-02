import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListDeptDto {
  @ApiPropertyOptional({ description: '部门名称', example: '研发部门' })
  @IsOptional()
  @IsString()
  dept_name?: string;

  @ApiPropertyOptional({ description: '状态', example: '0' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class GetDeptParamDto {
  @ApiProperty({ description: '部门ID', example: 200 })
  @IsNumber()
  @Type(() => Number)
  deptId: number;
}

export class CreateDeptDto {
  @ApiPropertyOptional({ description: '父部门ID', example: 100 })
  @IsOptional()
  @IsNumber()
  parent_id?: number;

  @ApiProperty({ description: '部门名称', example: '研发部门' })
  @IsString()
  dept_name: string;

  @ApiProperty({ description: '显示顺序', example: 1 })
  @IsNumber()
  order_num: number;

  @ApiPropertyOptional({ description: '负责人', example: 'admin' })
  @IsOptional()
  @IsString()
  leader?: string;

  @ApiPropertyOptional({ description: '联系电话', example: '15888888888' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: '邮箱', example: 'ry@qq.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: '状态', example: '0' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateDeptDto extends CreateDeptDto {
  @ApiProperty({ description: '部门ID', example: 200 })
  @IsNumber()
  dept_id: number;
}

export class DeleteDeptDto {
  @ApiProperty({ description: '部门ID', example: 200 })
  @IsNumber()
  dept_id: number;
}

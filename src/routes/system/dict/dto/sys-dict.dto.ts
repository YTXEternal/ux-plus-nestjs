import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Dict Type DTOs
export class ListDictTypeDto {
  @ApiPropertyOptional({ description: '页码', example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageNum?: number;

  @ApiPropertyOptional({ description: '每页数量', example: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize?: number;

  @ApiPropertyOptional({ description: '字典名称', example: '用户性别' })
  @IsOptional()
  @IsString()
  dict_name?: string;

  @ApiPropertyOptional({ description: '字典类型', example: 'sys_user_sex' })
  @IsOptional()
  @IsString()
  dict_type?: string;

  @ApiPropertyOptional({ description: '状态', example: '0' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateDictTypeDto {
  @ApiProperty({ description: '字典名称', example: '用户性别' })
  @IsString()
  dict_name: string;

  @ApiProperty({ description: '字典类型', example: 'sys_user_sex' })
  @IsString()
  dict_type: string;

  @ApiProperty({ description: '状态', example: '0' })
  @IsString()
  status: string;

  @ApiPropertyOptional({ description: '备注', example: '用户性别列表' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateDictTypeDto extends CreateDictTypeDto {
  @ApiProperty({ description: '字典ID', example: 1 })
  @IsNumber()
  dict_id: number;
}

export class DeleteDictTypeDto {
  @ApiProperty({ description: '字典ID列表', example: [1] })
  @IsArray()
  dict_ids: number[];
}

// Dict Data DTOs
export class ListDictDataDto {
  @ApiPropertyOptional({ description: '页码', example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageNum?: number;

  @ApiPropertyOptional({ description: '每页数量', example: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize?: number;

  @ApiPropertyOptional({ description: '字典类型', example: 'sys_user_sex' })
  @IsOptional()
  @IsString()
  dict_type?: string;

  @ApiPropertyOptional({ description: '字典标签', example: '男' })
  @IsOptional()
  @IsString()
  dict_label?: string;

  @ApiPropertyOptional({ description: '状态', example: '0' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateDictDataDto {
  @ApiProperty({ description: '字典类型', example: 'sys_user_sex' })
  @IsString()
  dict_type: string;

  @ApiProperty({ description: '字典标签', example: '男' })
  @IsString()
  dict_label: string;

  @ApiProperty({ description: '字典键值', example: '0' })
  @IsString()
  dict_value: string;

  @ApiPropertyOptional({ description: '样式属性', example: 'list-class' })
  @IsOptional()
  @IsString()
  css_class?: string;

  @ApiPropertyOptional({ description: '表格回显样式', example: 'default' })
  @IsOptional()
  @IsString()
  list_class?: string;

  @ApiProperty({ description: '字典排序', example: 1 })
  @IsNumber()
  dict_sort: number;

  @ApiProperty({ description: '状态', example: '0' })
  @IsString()
  status: string;

  @ApiPropertyOptional({ description: '备注', example: '性别男' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateDictDataDto extends CreateDictDataDto {
  @ApiProperty({ description: '字典编码', example: 1 })
  @IsNumber()
  dict_code: number;
}

export class DeleteDictDataDto {
  @ApiProperty({ description: '字典编码列表', example: [1] })
  @IsArray()
  dict_codes: number[];
}

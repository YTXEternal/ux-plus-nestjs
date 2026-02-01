import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Dict Type DTOs
export class ListDictTypeDto {
  @ApiPropertyOptional({ description: '页码' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageNum?: number;

  @ApiPropertyOptional({ description: '每页数量' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize?: number;

  @ApiPropertyOptional({ description: '字典名称' })
  @IsOptional()
  @IsString()
  dict_name?: string;

  @ApiPropertyOptional({ description: '字典类型' })
  @IsOptional()
  @IsString()
  dict_type?: string;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateDictTypeDto {
  @ApiProperty({ description: '字典名称' })
  @IsString()
  dict_name: string;

  @ApiProperty({ description: '字典类型' })
  @IsString()
  dict_type: string;

  @ApiProperty({ description: '状态' })
  @IsString()
  status: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateDictTypeDto extends CreateDictTypeDto {
  @ApiProperty({ description: '字典ID' })
  @IsNumber()
  dict_id: number;
}

export class DeleteDictTypeDto {
  @ApiProperty({ description: '字典ID列表' })
  @IsArray()
  dict_ids: number[];
}

// Dict Data DTOs
export class ListDictDataDto {
  @ApiPropertyOptional({ description: '页码' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageNum?: number;

  @ApiPropertyOptional({ description: '每页数量' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize?: number;

  @ApiPropertyOptional({ description: '字典类型' })
  @IsOptional()
  @IsString()
  dict_type?: string;

  @ApiPropertyOptional({ description: '字典标签' })
  @IsOptional()
  @IsString()
  dict_label?: string;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateDictDataDto {
  @ApiProperty({ description: '字典类型' })
  @IsString()
  dict_type: string;

  @ApiProperty({ description: '字典标签' })
  @IsString()
  dict_label: string;

  @ApiProperty({ description: '字典键值' })
  @IsString()
  dict_value: string;

  @ApiPropertyOptional({ description: '样式属性' })
  @IsOptional()
  @IsString()
  css_class?: string;

  @ApiPropertyOptional({ description: '表格回显样式' })
  @IsOptional()
  @IsString()
  list_class?: string;

  @ApiProperty({ description: '字典排序' })
  @IsNumber()
  dict_sort: number;

  @ApiProperty({ description: '状态' })
  @IsString()
  status: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateDictDataDto extends CreateDictDataDto {
  @ApiProperty({ description: '字典编码' })
  @IsNumber()
  dict_code: number;
}

export class DeleteDictDataDto {
  @ApiProperty({ description: '字典编码列表' })
  @IsArray()
  dict_codes: number[];
}

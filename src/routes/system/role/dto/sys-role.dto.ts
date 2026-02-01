import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListRoleDto {
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

  @ApiPropertyOptional({ description: '角色名称' })
  @IsOptional()
  @IsString()
  role_name?: string;

  @ApiPropertyOptional({ description: '权限字符' })
  @IsOptional()
  @IsString()
  role_key?: string;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称' })
  @IsString()
  role_name: string;

  @ApiProperty({ description: '权限字符' })
  @IsString()
  role_key: string;

  @ApiProperty({ description: '显示顺序' })
  @IsNumber()
  role_sort: number;

  @ApiProperty({ description: '状态' })
  @IsString()
  status: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;

  @ApiPropertyOptional({ description: '菜单ID列表' })
  @IsOptional()
  @IsArray()
  menu_ids?: number[];

  @ApiPropertyOptional({ description: '菜单树选择项是否关联显示' })
  @IsOptional()
  @IsBoolean()
  menu_check_strictly?: boolean;

  @ApiPropertyOptional({ description: '部门树选择项是否关联显示' })
  @IsOptional()
  @IsBoolean()
  dept_check_strictly?: boolean;
}

export class UpdateRoleDto extends CreateRoleDto {
  @ApiProperty({ description: '角色ID' })
  @IsNumber()
  role_id: number;
}

export class ChangeRoleStatusDto {
  @ApiProperty({ description: '角色ID' })
  @IsNumber()
  role_id: number;

  @ApiProperty({ description: '状态' })
  @IsString()
  status: string;
}

export class DeleteRoleDto {
  @ApiProperty({ description: '角色ID列表' })
  @IsArray()
  role_ids: number[];
}

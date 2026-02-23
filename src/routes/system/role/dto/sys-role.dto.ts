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

  @ApiPropertyOptional({ description: '角色名称', example: '普通角色' })
  @IsOptional()
  @IsString()
  role_name?: string;

  @ApiPropertyOptional({ description: '权限字符', example: 'common' })
  @IsOptional()
  @IsString()
  role_key?: string;

  @ApiPropertyOptional({ description: '状态', example: '0' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class GetRoleParamDto {
  @ApiProperty({ description: '角色ID', example: 1 })
  @IsNumber()
  @Type(() => Number)
  roleId: number;
}

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称', example: '普通角色' })
  @IsString()
  role_name: string;

  @ApiProperty({ description: '权限字符', example: 'common' })
  @IsString()
  role_key: string;

  @ApiProperty({ description: '显示顺序', example: 1 })
  @IsNumber()
  role_sort: number;

  @ApiProperty({ description: '状态', example: '0' })
  @IsString()
  status: string;

  @ApiPropertyOptional({ description: '备注', example: '普通角色' })
  @IsOptional()
  @IsString()
  remark?: string;

  @ApiPropertyOptional({ description: '菜单ID列表', example: [1, 2] })
  @IsOptional()
  @IsArray()
  menu_ids?: number[];

  @ApiPropertyOptional({
    description: '菜单树选择项是否关联显示',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  menu_check_strictly?: boolean;

  @ApiPropertyOptional({
    description: '部门树选择项是否关联显示',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  dept_check_strictly?: boolean;
  @ApiPropertyOptional({
    description: '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）',
    example: "1",
  })
  @IsOptional()
  data_scope?:"1"|"2"|"3"|"4"
}

export class UpdateRoleDto extends CreateRoleDto {
  @ApiProperty({ description: '角色ID', example: 1 })
  @IsNumber()
  role_id: number;
}

export class ChangeRoleStatusDto {
  @ApiProperty({ description: '角色ID', example: 1 })
  @IsNumber()
  role_id: number;

  @ApiProperty({ description: '状态', example: '0' })
  @IsString()
  status: string;
}

export class DeleteRoleDto {
  @ApiProperty({ description: '角色ID列表', example: [1] })
  @IsArray()
  role_ids: number[];
}

import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListMenuDto {
  @ApiPropertyOptional({ description: '菜单名称', example: '系统管理' })
  @IsOptional()
  @IsString()
  menu_name?: string;

  @ApiPropertyOptional({ description: '状态', example: '0' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class GetMenuParamDto {
  @ApiProperty({ description: '菜单ID', example: 1 })
  @IsNumber()
  @Type(() => Number)
  menuId: number;
}

export class CreateMenuDto {
  @ApiPropertyOptional({ description: '父菜单ID', example: 0 })
  @IsOptional()
  @IsNumber()
  parent_id?: number;

  @ApiProperty({ description: '菜单名称', example: '系统管理' })
  @IsString()
  menu_name: string;

  @ApiProperty({ description: '显示顺序', example: 1 })
  @IsNumber()
  order_num: number;

  @ApiPropertyOptional({ description: '路由地址', example: 'system' })
  @IsOptional()
  @IsString()
  path?: string;

  @ApiPropertyOptional({
    description: '组件路径',
    example: 'system/user/index',
  })
  @IsOptional()
  @IsString()
  component?: string;

  @ApiPropertyOptional({ description: '是否为外链', example: 0 })
  @IsOptional()
  @IsNumber()
  is_frame?: number;

  @ApiPropertyOptional({ description: '是否缓存', example: 0 })
  @IsOptional()
  @IsNumber()
  is_cache?: number;

  @ApiProperty({ description: '菜单类型', example: 'M' })
  @IsString()
  menu_type: string;

  @ApiPropertyOptional({ description: '显示状态', example: '0' })
  @IsOptional()
  @IsString()
  visible?: string;

  @ApiPropertyOptional({ description: '菜单状态', example: '0' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: '权限标识', example: 'system:user:list' })
  @IsOptional()
  @IsString()
  perms?: string;

  @ApiPropertyOptional({ description: '菜单图标', example: '#' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ description: '路由参数', example: '{"id": 1}' })
  @IsOptional()
  @IsString()
  query?: string;
}

export class UpdateMenuDto extends CreateMenuDto {
  @ApiProperty({ description: '菜单ID', example: 1 })
  @IsNumber()
  menu_id: number;
}

export class DeleteMenuDto {
  @ApiProperty({ description: '菜单ID', example: 1 })
  @IsNumber()
  menu_id: number;
}

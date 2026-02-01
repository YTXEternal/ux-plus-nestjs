import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListMenuDto {
  @ApiPropertyOptional({ description: '菜单名称' })
  @IsOptional()
  @IsString()
  menu_name?: string;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateMenuDto {
  @ApiPropertyOptional({ description: '父菜单ID' })
  @IsOptional()
  @IsNumber()
  parent_id?: number;

  @ApiProperty({ description: '菜单名称' })
  @IsString()
  menu_name: string;

  @ApiProperty({ description: '显示顺序' })
  @IsNumber()
  order_num: number;

  @ApiPropertyOptional({ description: '路由地址' })
  @IsOptional()
  @IsString()
  path?: string;

  @ApiPropertyOptional({ description: '组件路径' })
  @IsOptional()
  @IsString()
  component?: string;

  @ApiPropertyOptional({ description: '是否为外链' })
  @IsOptional()
  @IsNumber()
  is_frame?: number;

  @ApiPropertyOptional({ description: '是否缓存' })
  @IsOptional()
  @IsNumber()
  is_cache?: number;

  @ApiProperty({ description: '菜单类型' })
  @IsString()
  menu_type: string;

  @ApiPropertyOptional({ description: '显示状态' })
  @IsOptional()
  @IsString()
  visible?: string;

  @ApiPropertyOptional({ description: '菜单状态' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: '权限标识' })
  @IsOptional()
  @IsString()
  perms?: string;

  @ApiPropertyOptional({ description: '菜单图标' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ description: '路由参数' })
  @IsOptional()
  @IsString()
  query?: string;
}

export class UpdateMenuDto extends CreateMenuDto {
  @ApiProperty({ description: '菜单ID' })
  @IsNumber()
  menu_id: number;
}

export class DeleteMenuDto {
  @ApiProperty({ description: '菜单ID' })
  @IsNumber()
  menu_id: number;
}

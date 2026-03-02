import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateShopDto {
  @ApiProperty({ description: '门店名称', example: '旗舰店' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '门店地址', example: '北京市朝阳区...' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ description: '联系电话', example: '010-12345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: '管理人ID (用户ID)', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  conductor: number;
}

export class UpdateShopDto extends CreateShopDto {
  @ApiProperty({ description: '门店ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  shop_id: number;
}

export class DeleteShopDto {
  @ApiProperty({ description: '门店ID列表', example: [1, 2] })
  @IsArray()
  @IsNotEmpty()
  shop_ids: number[];
}

export class ListShopDto {
  @ApiPropertyOptional({ description: '页码', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageNum?: number;

  @ApiPropertyOptional({ description: '每页数量', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number;

  @ApiPropertyOptional({ description: '门店名称（模糊搜索）', example: '旗舰' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '门店地址（模糊搜索）', example: '北京' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: '删除标志（0正常 2删除）', example: '0' })
  @IsOptional()
  @IsString()
  del_flag?: string;
}

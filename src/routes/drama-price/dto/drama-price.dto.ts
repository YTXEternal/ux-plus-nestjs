import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDramaPriceDto {
  @ApiProperty({ description: '店铺ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  shop_id: number;

  @ApiProperty({ description: '剧本ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  drama_id: number;

  @ApiProperty({ description: '价格', example: 99.99 })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class UpdateDramaPriceDto {
  @ApiProperty({ description: '定价ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  dramaprice_id: number;

  @ApiProperty({ description: '价格', example: 99.99 })
  @IsOptional()
  @IsNumber()
  price?: number;
}

export class ListDramaPriceDto {
  @ApiProperty({ description: '当前页', example: 1, required: false })
  @IsOptional()
  pageNum?: number;

  @ApiProperty({ description: '每页条数', example: 10, required: false })
  @IsOptional()
  pageSize?: number;

  @ApiProperty({ description: '店铺ID', example: 1, required: false })
  @IsOptional()
  shop_id?: number;

  @ApiProperty({ description: '剧本ID', example: 1, required: false })
  @IsOptional()
  drama_id?: number;
}

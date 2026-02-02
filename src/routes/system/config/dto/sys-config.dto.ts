import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListConfigDto {
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

  @ApiPropertyOptional({
    description: '参数名称',
    example: '主框架页-默认皮肤样式名称',
  })
  @IsOptional()
  @IsString()
  config_name?: string;

  @ApiPropertyOptional({
    description: '参数键名',
    example: 'sys.index.skinName',
  })
  @IsOptional()
  @IsString()
  config_key?: string;

  @ApiPropertyOptional({ description: '系统内置', example: 'Y' })
  @IsOptional()
  @IsString()
  config_type?: string;
}

export class GetConfigParamDto {
  @ApiProperty({ description: '参数ID', example: 1 })
  @IsNumber()
  @Type(() => Number)
  configId: number;
}

export class GetConfigKeyParamDto {
  @ApiProperty({ description: '参数键名', example: 'sys.index.skinName' })
  @IsString()
  configKey: string;
}

export class CreateConfigDto {
  @ApiProperty({
    description: '参数名称',
    example: '主框架页-默认皮肤样式名称',
  })
  @IsString()
  config_name: string;

  @ApiProperty({ description: '参数键名', example: 'sys.index.skinName' })
  @IsString()
  config_key: string;

  @ApiProperty({ description: '参数键值', example: 'skin-blue' })
  @IsString()
  config_value: string;

  @ApiPropertyOptional({ description: '系统内置', example: 'Y' })
  @IsOptional()
  @IsString()
  config_type?: string;

  @ApiPropertyOptional({
    description: '备注',
    example: '蓝色 skin-blue、绿色 skin-green',
  })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateConfigDto extends CreateConfigDto {
  @ApiProperty({ description: '参数ID', example: 1 })
  @IsNumber()
  config_id: number;
}

export class DeleteConfigDto {
  @ApiProperty({ description: '参数ID列表', example: [1] })
  @IsArray()
  config_ids: number[];
}

import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListConfigDto {
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

  @ApiPropertyOptional({ description: '参数名称' })
  @IsOptional()
  @IsString()
  config_name?: string;

  @ApiPropertyOptional({ description: '参数键名' })
  @IsOptional()
  @IsString()
  config_key?: string;

  @ApiPropertyOptional({ description: '系统内置' })
  @IsOptional()
  @IsString()
  config_type?: string;
}

export class CreateConfigDto {
  @ApiProperty({ description: '参数名称' })
  @IsString()
  config_name: string;

  @ApiProperty({ description: '参数键名' })
  @IsString()
  config_key: string;

  @ApiProperty({ description: '参数键值' })
  @IsString()
  config_value: string;

  @ApiPropertyOptional({ description: '系统内置' })
  @IsOptional()
  @IsString()
  config_type?: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateConfigDto extends CreateConfigDto {
  @ApiProperty({ description: '参数ID' })
  @IsNumber()
  config_id: number;
}

export class DeleteConfigDto {
  @ApiProperty({ description: '参数ID列表' })
  @IsArray()
  config_ids: number[];
}

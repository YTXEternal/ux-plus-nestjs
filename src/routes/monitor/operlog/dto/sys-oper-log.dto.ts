import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListOperLogDto {
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

  @ApiPropertyOptional({ description: '系统模块', example: '用户管理' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '操作人员', example: 'admin' })
  @IsOptional()
  @IsString()
  oper_name?: string;

  @ApiPropertyOptional({ description: '业务类型', example: '1' })
  @IsOptional()
  @IsString()
  business_type?: string;

  @ApiPropertyOptional({ description: '状态', example: '0' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class DeleteOperLogDto {
  @ApiProperty({ description: '操作ID列表', example: [1] })
  @IsArray()
  oper_ids: number[];
}

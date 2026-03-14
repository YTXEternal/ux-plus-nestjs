import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChatRequestDto {
  @ApiProperty({ description: '用户查询内容' })
  @IsString()
  query: string;

  @ApiPropertyOptional({ description: '会话ID' })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiPropertyOptional({ description: '模型名称', default: 'gpt-3.5-turbo' })
  @IsOptional()
  @IsString()
  model?: string;
}

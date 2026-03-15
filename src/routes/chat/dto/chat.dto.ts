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

  @ApiPropertyOptional({
    description: '模型名称',
    default: 'deepseek-ai/DeepSeek-R1',
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({
    description: '上次的文件id',
  })
  @IsOptional()
  file_ids?: string[];
}

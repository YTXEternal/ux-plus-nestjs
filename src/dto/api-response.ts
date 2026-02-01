import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty({ description: '状态码' })
  public readonly code: number;

  @ApiProperty({ description: '消息' })
  public readonly message: string;

  @ApiProperty({ description: '数据', required: false })
  public readonly data?: T;

  constructor(code: number, message: string, data?: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}

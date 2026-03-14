import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Res,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto/chat.dto';
import { AuthTokenGuard } from '@/guards/auth-token/auth-token.guard';
import { ApiResponse } from '@/dto/api-response';

@ApiTags('聊天')
@ApiBearerAuth()
@Controller('chat')
@UseGuards(AuthTokenGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('session')
  @ApiOperation({ summary: '创建新会话' })
  @ApiBody({
    schema: { type: 'object', properties: { title: { type: 'string' } } },
  })
  async createSession(@Req() req, @Body('title') title?: string) {
    const userId = req.user.user_id;
    const data = await this.chatService.createSession(userId, title);
    return new ApiResponse(200, 'success', data);
  }

  @Get('sessions')
  @ApiOperation({ summary: '获取会话列表' })
  async getSessions(@Req() req) {
    const userId = req.user.user_id;
    const data = await this.chatService.getSessions(userId);
    return new ApiResponse(200, 'success', data);
  }

  @Get('session/:sessionId/messages')
  @ApiOperation({ summary: '获取会话历史消息' })
  async getSessionMessages(@Req() req, @Param('sessionId') sessionId: string) {
    const userId = req.user.user_id;
    const data = await this.chatService.getSessionMessages(userId, sessionId);
    return new ApiResponse(200, 'success', data);
  }

  @Delete('session')
  @ApiOperation({ summary: '删除会话' })
  @ApiBody({
    schema: { type: 'object', properties: { sessionId: { type: 'string' } } },
  })
  async deleteSession(@Req() req, @Body('sessionId') sessionId: string) {
    const userId = req.user.user_id;
    await this.chatService.deleteSession(userId, sessionId);
    return new ApiResponse(200, 'success');
  }

  @Post('stream')
  @ApiOperation({ summary: '流式对话接口' })
  @ApiBody({ type: ChatRequestDto })
  async streamChat(
    @Req() req,
    @Body() body: ChatRequestDto,
    @Res() res: Response,
  ) {
    const userId = req.user.user_id;
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const observable = await this.chatService.generateStream(userId, body);

    const subscription = observable.subscribe({
      next: (data) => {
        // SSE 格式: data: {json}\n\n
        res.write(`data: ${JSON.stringify(data.data)}\n\n`);
      },
      error: (err) => {
        console.error('Stream error:', err);
        res.write(
          `data: ${JSON.stringify({ status: 'error', content: 'Internal Server Error' })}\n\n`,
        );
        res.end();
      },
      complete: () => {
        res.end();
      },
    });

    // 当客户端断开连接时取消订阅
    req.on('close', () => {
      subscription.unsubscribe();
    });
  }
}

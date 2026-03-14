import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel as InjectMongooseModel } from '@nestjs/mongoose';
import { InjectModel as InjectSequelizeModel } from '@nestjs/sequelize';
import { Model } from 'mongoose';
import { Observable, Subject } from 'rxjs';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { ChatRequestDto } from './dto/chat.dto';
import { SysUserService } from '@/routes/system/user/sys-user.service';
import { ChatSession } from '@/databases/mysql-database/model/chat-session.model';
import {
  ChatMessage,
  ChatMessageDocument,
} from '@/databases/mongodb/schemas/chat-message.schema';

interface ChatResponse {
  data: {
    content: string;
    time: string;
    status: 'success' | 'error' | 'loading';
    role: 'assistant' | 'user';
    sessionId?: string; // 返回会话ID，如果是新建的话
  };
}

@Injectable()
export class ChatService {
  constructor(
    private readonly sysUserService: SysUserService,
    @InjectSequelizeModel(ChatSession)
    private readonly chatSessionModel: typeof ChatSession,
    @InjectMongooseModel(ChatMessage.name)
    private readonly chatMessageModel: Model<ChatMessageDocument>,
  ) {}

  /**
   * 生成流式对话响应
   * @param userId 用户ID
   * @param dto 请求参数
   */
  async generateStream(
    userId: number,
    dto: ChatRequestDto,
  ): Promise<Observable<ChatResponse>> {
    const { data: user } = await this.sysUserService.findOne(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const apiKey = user.apikey;
    if (!apiKey) {
      throw new HttpException(
        'API Key not configured. Please set it in User Center.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 1. 处理会话 (如果未提供 sessionId，则创建新会话)
    let sessionId = dto.sessionId;
    let isNewSession = false;

    if (!sessionId) {
      sessionId = uuidv4();
      isNewSession = true;
      // 创建新会话记录 (MySQL)
      await this.chatSessionModel.create({
        session_id: sessionId,
        user_id: userId,
        title: dto.query.slice(0, 50), // 使用用户第一句话的前50个字符作为标题
        create_time: new Date(),
        update_time: new Date(),
        del_flag: '0',
      } as any);
    } else {
      // 验证会话是否存在且属于当前用户
      const session = await this.chatSessionModel.findOne({
        where: { session_id: sessionId, user_id: userId, del_flag: '0' },
      });
      if (!session) {
        throw new HttpException(
          'Session not found or access denied',
          HttpStatus.FORBIDDEN,
        );
      }
      // 更新会话时间
      await session.update({ update_time: new Date() });
    }

    // 2. 保存用户消息到 MongoDB
    await this.chatMessageModel.create({
      session_id: sessionId,
      role: 'user',
      content: dto.query,
      create_time: new Date(),
    });

    // 3. 获取历史消息构建上下文
    // 只获取最近的 N 条消息作为上下文，避免 token 超限
    const historyMessages = await this.chatMessageModel
      .find({ session_id: sessionId })
      .sort({ create_time: 1 })
      .limit(20) // 限制最近 20 条
      .exec();

    const messages = historyMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // 4. 创建 Subject 用于推送数据流
    const subject = new Subject<ChatResponse>();

    // 区分测试环境与真实调用
    // 如果 apiKey 以 'test_' 开头，则使用模拟数据，保证 E2E 测试不消耗额度且稳定通过
    if (apiKey.startsWith('test_')) {
      void this.mockStreamResponse(subject, dto.query, sessionId, isNewSession);
    } else {
      void this.realStreamResponse(
        subject,
        messages, // 传入包含历史记录的完整消息列表
        apiKey,
        dto.model || 'gpt-3.5-turbo',
        sessionId,
        isNewSession,
      );
    }

    return subject.asObservable();
  }

  /**
   * 创建新会话
   * @param userId 用户ID
   * @param title 会话标题
   */
  async createSession(userId: number, title?: string) {
    const sessionId = uuidv4();
    const sessionTitle = title || '新会话';

    await this.chatSessionModel.create({
      session_id: sessionId,
      user_id: userId,
      title: sessionTitle,
      create_time: new Date(),
      update_time: new Date(),
      del_flag: '0',
    } as any);

    return { sessionId, title: sessionTitle };
  }

  /**
   * 获取会话列表
   */
  async getSessions(userId: number) {
    return this.chatSessionModel.findAll({
      where: { user_id: userId, del_flag: '0' },
      order: [['update_time', 'DESC']],
    });
  }

  /**
   * 获取指定会话的消息记录
   */
  async getSessionMessages(userId: number, sessionId: string) {
    // 验证会话权限
    const session = await this.chatSessionModel.findOne({
      where: { session_id: sessionId, user_id: userId, del_flag: '0' },
    });
    if (!session) {
      throw new HttpException(
        'Session not found or access denied',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.chatMessageModel
      .find({ session_id: sessionId })
      .sort({ create_time: 1 })
      .exec();
  }

  /**
   * 删除会话
   */
  async deleteSession(userId: number, sessionId: string) {
    const session = await this.chatSessionModel.findOne({
      where: { session_id: sessionId, user_id: userId, del_flag: '0' },
    });

    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }

    // 软删除 MySQL 会话
    await session.update({ del_flag: '2' });

    // (可选) 物理删除 MongoDB 消息，或者保留用于审计
    // await this.chatMessageModel.deleteMany({ session_id: sessionId });

    return { success: true };
  }

  /**
   * 调用 OpenAI 真实接口并流式返回
   */
  private async realStreamResponse(
    subject: Subject<ChatResponse>,
    messages: any[],
    apiKey: string,
    model: string,
    sessionId: string,
    isNewSession: boolean,
  ) {
    let fullContent = '';
    try {
      const openai = new OpenAI({
        apiKey: apiKey,
      });

      const stream = await openai.chat.completions.create({
        model: model,
        messages: messages,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullContent += content;
          subject.next({
            data: {
              content,
              time: new Date().toISOString(),
              status: 'success',
              role: 'assistant',
              sessionId: isNewSession ? sessionId : undefined,
            },
          });
          isNewSession = false; // 只在第一帧返回 sessionId
        }
      }

      // 5. 保存 AI 回复到 MongoDB
      await this.chatMessageModel.create({
        session_id: sessionId,
        role: 'assistant',
        content: fullContent,
        create_time: new Date(),
      });

      // 结束标记
      subject.next({
        data: {
          content: '[DONE]',
          time: new Date().toISOString(),
          status: 'success',
          role: 'assistant',
        },
      });
      subject.complete();
    } catch (error) {
      console.error('OpenAI Stream Error:', error);

      // 即使出错，也尝试保存已生成的部分内容
      if (fullContent) {
        await this.chatMessageModel.create({
          session_id: sessionId,
          role: 'assistant',
          content: fullContent,
          create_time: new Date(),
        });
      }

      subject.next({
        data: {
          content: 'Sorry, I encountered an error processing your request.',
          time: new Date().toISOString(),
          status: 'error',
          role: 'assistant',
        },
      });
      subject.complete();
    }
  }

  /**
   * 模拟流式响应
   */
  private async mockStreamResponse(
    subject: Subject<ChatResponse>,
    query: string,
    sessionId: string,
    isNewSession: boolean,
  ) {
    const responses = [
      '正在思考...',
      '您好，我是您的 AI 助手。',
      `您刚才询问了：${query}`,
      '根据我的理解，',
      'Ant Design X 是一个非常棒的库！',
      '它可以帮助您快速构建 AI 聊天应用。',
      '希望这个回答对您有帮助！',
      '[DONE]', // 结束标记
    ];

    let fullContent = '';
    let i = 0;
    const interval = setInterval(() => {
      void (async () => {
        if (i >= responses.length) {
          clearInterval(interval);

          // 保存模拟回复
          await this.chatMessageModel.create({
            session_id: sessionId,
            role: 'assistant',
            content: fullContent,
            create_time: new Date(),
          });

          subject.complete();
          return;
        }

        const content = responses[i];
        const isDone = content === '[DONE]';

        if (isDone) {
          subject.next({
            data: {
              content: '[DONE]',
              time: new Date().toISOString(),
              status: 'success',
              role: 'assistant',
            },
          });

          // 保存模拟回复 (在 interval 结束前保存)
          await this.chatMessageModel.create({
            session_id: sessionId,
            role: 'assistant',
            content: fullContent,
            create_time: new Date(),
          });

          clearInterval(interval);
          subject.complete();
        } else {
          const chunk = content + '\n';
          fullContent += chunk;
          subject.next({
            data: {
              content: chunk,
              time: new Date().toISOString(),
              status: 'success',
              role: 'assistant',
              sessionId: isNewSession ? sessionId : undefined,
            },
          });
          isNewSession = false;
        }
        i++;
      })();
    }, 100);
  }
}

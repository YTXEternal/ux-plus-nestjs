import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel as InjectMongooseModel } from '@nestjs/mongoose';
import { InjectModel as InjectSequelizeModel } from '@nestjs/sequelize';
import { Model } from 'mongoose';
import { Observable, Subject } from 'rxjs';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { PDFParse } from 'pdf-parse';

import { ChatRequestDto } from './dto/chat.dto';
import { SysUserService } from '@/routes/system/user/sys-user.service';
import { ChatSession } from '@/databases/mysql-database/model/chat-session.model';
import { File } from '@/databases/mysql-database/model/file.model';
import {
  ChatMessage,
  ChatMessageDocument,
} from '@/databases/mongodb/schemas/chat-message.schema';
const promptPath = path.join(
  process.cwd(),
  './src/routes/chat/prompt/面试设定.md',
);
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
    @InjectSequelizeModel(File)
    private readonly fileModel: typeof File,
    @InjectMongooseModel(ChatMessage.name)
    private readonly chatMessageModel: Model<ChatMessageDocument>,
  ) {}

  // 辅助函数
  private generateTitle(content: string): string {
    return content.slice(0, 10) + (content.length > 10 ? '...' : '');
  }

  private async extractFileContent(file: File): Promise<string> {
    const filePath = path.join(process.cwd(), 'static/uploads', file.name);
    if (!fs.existsSync(filePath)) {
      return '';
    }

    const ext = path.extname(file.name).toLowerCase();
    try {
      if (ext === '.txt' || ext === '.md') {
        return fs.readFileSync(filePath, 'utf-8');
      } else if (ext === '.pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const parser = new PDFParse({ data: dataBuffer });
        const data = await parser.getText();
        await parser.destroy();
        return data.text;
      }
    } catch (error) {
      console.error(`Error reading file ${file.name}:`, error);
    }
    return '';
  }

  private async appendFileContext(
    messages: any[],
    fileIds: string[] | undefined,
  ) {
    if (!fileIds || fileIds.length === 0) {
      return;
    }

    const validFileIds = fileIds
      .map((id) => Number(id))
      .filter((id) => !isNaN(id));

    if (validFileIds.length === 0) {
      return;
    }

    const files = await this.fileModel.findAll({
      where: {
        file_id: validFileIds,
        del_flag: '0',
      },
    });

    const fileContents: { name: string; type: string; content: string }[] = [];
    for (const file of files) {
      const content = await this.extractFileContent(file);
      if (content) {
        fileContents.push({
          name: file.name,
          type: file.type,
          content: content.slice(0, 10000), // 限制长度防止超 token
        });
      }
    }

    if (fileContents.length > 0) {
      const systemPrompt = `当前会话上传文件：${JSON.stringify(fileContents)}`;
      messages.unshift({
        role: 'system',
        content: systemPrompt,
      });
    }
  }

  private async appendSystemPrompt(messages: any[]) {
    try {
      console.log('promptPath', promptPath, fs.existsSync(promptPath));
      if (fs.existsSync(promptPath)) {
        const content = fs.readFileSync(promptPath, 'utf-8');
        messages.unshift({
          role: 'system',
          content: content,
        });
      }
    } catch (error) {
      console.error('Error reading system prompt:', error);
    }
  }

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
        title: this.generateTitle(dto.query),
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

      // 更新会话时间，如果标题是"新增会话"，则更新标题
      const updateData: any = { update_time: new Date() };
      if (session.title === '新增会话') {
        updateData.title = this.generateTitle(dto.query);
      }
      await session.update(updateData);
    }

    // 2. 保存用户消息到 MongoDB
    await this.chatMessageModel.create({
      session_id: sessionId,
      role: 'user',
      content: dto.query,
      file_ids: dto.file_ids || [],
      create_time: new Date(),
    });

    // 3. 获取历史消息构建上下文
    // 只获取最近的 N 条消息作为上下文，避免 token 超限
    const historyMessages = await this.chatMessageModel
      .find({ session_id: sessionId })
      .sort({ create_time: 1 })
      .limit(20) // 限制最近 20 条
      .exec();

    const messages: any[] = historyMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // 处理文件内容
    await this.appendFileContext(messages, dto.file_ids);

    // 处理固定设定
    await this.appendSystemPrompt(messages);

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
        dto.model || 'deepseek-ai/DeepSeek-R1',
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
  async getSessionMessages(userId: number, sessionId: string): Promise<any[]> {
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

    const messages = await this.chatMessageModel
      .find({ session_id: sessionId })
      .sort({ create_time: 1 })
      .lean()
      .exec();

    // 收集所有涉及的 file_ids
    const allFileIds = new Set<string>();
    messages.forEach((msg: any) => {
      if (msg.file_ids && Array.isArray(msg.file_ids)) {
        msg.file_ids.forEach((id: string) => allFileIds.add(id));
      }
    });

    // 批量查询文件信息
    let fileMap = new Map<number, File>();
    if (allFileIds.size > 0) {
      const fileIdArray = Array.from(allFileIds).map((id) => Number(id));
      const files = await this.fileModel.findAll({
        where: {
          file_id: fileIdArray,
          del_flag: '0',
        },
      });
      fileMap = new Map(files.map((f) => [f.file_id, f]));
    }

    // 组装返回数据
    return messages.map((msg: any) => {
      const fileObjects: File[] = [];
      if (msg.file_ids && Array.isArray(msg.file_ids)) {
        msg.file_ids.forEach((id: string) => {
          const file = fileMap.get(Number(id));
          if (file) {
            fileObjects.push(file);
          }
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return {
        ...msg,
        files: fileObjects,
      };
    });
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
   * 撤回（删除）单条消息
   * @param userId 用户ID
   * @param messageId 消息ID
   */
  async deleteMessage(userId: number, messageId: string) {
    // 1. 查找消息
    const message = await this.chatMessageModel.findById(messageId);
    if (!message) {
      throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
    }

    // 2. 查找所属会话并验证权限
    const session = await this.chatSessionModel.findOne({
      where: { session_id: message.session_id, user_id: userId, del_flag: '0' },
    });

    if (!session) {
      throw new HttpException(
        'Session not found or access denied',
        HttpStatus.FORBIDDEN,
      );
    }

    // 3. 物理删除消息
    await this.chatMessageModel.deleteOne({ _id: messageId });

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
        baseURL: 'https://api.siliconflow.cn/v1',
      });

      console.log('opt', {
        model: model,
        messages: messages,
        stream: true,
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

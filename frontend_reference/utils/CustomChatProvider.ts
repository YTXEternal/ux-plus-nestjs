import { AbstractChatProvider, XRequestOptions } from '@ant-design/x-sdk';
import { ChatInput, ChatOutput, ChatMessage } from '../types/chat';

/**
 * 自定义聊天提供者，适配后端流式接口
 */
export class CustomChatProvider extends AbstractChatProvider<ChatMessage, ChatInput, ChatOutput> {
  
  /**
   * 将 useXChat 的请求参数转换为后端 API 需要的参数格式
   */
  transformParams(
    requestParams: Partial<ChatInput>,
    options: XRequestOptions<ChatInput, ChatOutput, ChatMessage>,
  ): ChatInput {
    // 确保 query 存在
    if (!requestParams.query) {
      throw new Error('Query is required');
    }

    return {
      query: requestParams.query,
      sessionId: requestParams.sessionId || undefined,
      ...(options?.params || {}),
    };
  }

  /**
   * 将用户输入的参数转换为本地显示的初始消息
   */
  transformLocalMessage(requestParams: Partial<ChatInput>): ChatMessage {
    return {
      id: Date.now().toString(),
      content: requestParams.query || '',
      role: 'user',
      timestamp: Date.now(),
      status: 'success',
    };
  }

  /**
   * 将后端返回的流式数据块转换为消息对象
   */
  transformMessage(info: { originMessage: ChatMessage; chunk: ChatOutput }): ChatMessage {
    const { originMessage, chunk } = info;

    // 处理后端返回的结束标记
    if (chunk.content === '[DONE]') {
      return {
        ...originMessage,
        status: 'success',
      };
    }

    // 处理错误状态
    if (chunk.status === 'error') {
       return {
        ...originMessage,
        content: chunk.content || 'Something went wrong',
        status: 'error',
      };
    }

    // 累加消息内容
    // 注意：这里假设后端返回的是增量内容 (delta)，如果是全量内容则直接赋值
    // 根据 ChatService 的 mockStreamResponse，返回的是 content + '\n'，是增量。
    // 但是 AbstractChatProvider 的默认行为通常是将 chunk 视为增量并由 Provider 决定如何合并。
    // 这里的实现是返回新的 Message 对象。
    
    return {
      ...originMessage,
      content: (originMessage.content || '') + (chunk.content || ''),
      role: 'assistant',
      timestamp: new Date(chunk.time).getTime(),
      status: 'loading',
    };
  }
}

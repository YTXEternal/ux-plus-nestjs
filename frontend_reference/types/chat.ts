// 聊天相关类型定义

export interface ChatInput {
  query: string;
  sessionId?: string;
}

export interface ChatOutput {
  content: string;
  time: string;
  status: 'success' | 'error' | 'loading';
  role: 'assistant' | 'user';
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  status?: 'success' | 'error' | 'loading';
}

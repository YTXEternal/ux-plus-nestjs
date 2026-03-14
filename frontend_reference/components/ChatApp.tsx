import React, { useEffect, useMemo, useState } from 'react';
import { Bubble, Sender, Prompts, Welcome, useXAgent, useXChat } from '@ant-design/x';
import { XRequest } from '@ant-design/x-sdk';
import { UserOutlined, SmileOutlined, FireOutlined } from '@ant-design/icons';
import { CustomChatProvider } from '../utils/CustomChatProvider';
import { ChatMessage } from '../types/chat';

// 假设 token 存储在 localStorage 中
const getToken = () => localStorage.getItem('token');

const ChatApp: React.FC = () => {
  // 定义预设问题
  const items = [
    {
      key: '1',
      icon: <SmileOutlined style={{ color: '#52C41A' }} />,
      label: 'Ant Design X 是什么？',
      description: '了解 Ant Design X 的核心功能',
    },
    {
      key: '2',
      icon: <FireOutlined style={{ color: '#F5222D' }} />,
      label: '如何自定义 ChatProvider？',
      description: '学习适配流式接口',
    },
  ];

  // 配置 XRequest
  const request = useMemo(() => {
    return XRequest({
      baseURL: '/api/v1/chat/stream', // 指向我们创建的后端接口
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 自动携带 Token
        Authorization: `Bearer ${getToken()}`,
      },
      // 自定义响应转换 (如果后端直接返回 SSE 格式，XRequest 会自动处理，这里主要是处理非 SSE 错误)
      transformResponse: (data) => {
        return data;
      },
    });
  }, []);

  // 实例化 Provider
  const provider = useMemo(() => {
    return new CustomChatProvider({
      request: request,
    });
  }, [request]);

  // 使用 useXChat Hook
  const {
    messages,
    inputValue,
    setInputValue,
    onSendMessage,
    status,
  } = useXChat({
    provider,
    // 初始消息
    defaultMessages: [
      {
        id: 'welcome',
        content: '你好！我是你的 AI 助手，有什么可以帮你的吗？',
        role: 'assistant',
        timestamp: Date.now(),
        status: 'success',
      },
    ],
  });

  // 渲染消息列表
  const renderMessages = () => {
    return messages.map((msg: ChatMessage) => (
      <Bubble
        key={msg.id}
        content={msg.content}
        role={msg.role === 'user' ? 'user' : 'ai'}
        avatar={msg.role === 'user' ? { icon: <UserOutlined /> } : { style: { backgroundColor: '#1677FF' } }}
        loading={msg.status === 'loading'}
        style={{ marginBottom: 16 }}
      />
    ));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 800, margin: '0 auto', padding: 20 }}>
      {/* 消息区域 */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 20 }}>
        {messages.length === 0 ? (
          <Welcome
            variant="borderless"
            icon="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
            title="欢迎使用 AI 助手"
            description="我可以帮你解答问题、编写代码、或者只是聊聊天。"
          />
        ) : (
          renderMessages()
        )}
      </div>

      {/* 预设提示词 (仅当没有消息或只有欢迎消息时显示) */}
      {messages.length <= 1 && (
        <div style={{ marginBottom: 20 }}>
          <Prompts
            title="猜你想问"
            items={items}
            onItemClick={(item) => onSendMessage(item.data.label)}
          />
        </div>
      )}

      {/* 输入区域 */}
      <Sender
        value={inputValue}
        onChange={setInputValue}
        onSubmit={(v) => {
          onSendMessage(v);
          setInputValue('');
        }}
        loading={status === 'loading'}
        placeholder="请输入您的问题..."
      />
    </div>
  );
};

export default ChatApp;

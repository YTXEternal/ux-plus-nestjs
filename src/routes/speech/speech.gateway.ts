import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { SpeechService } from './speech.service';
import { UxJwtService } from '@/modules/ux-jwt/ux-jwt.service';
import * as vosk from 'vosk';

/**
 * 语音识别网关
 *
 * 处理 WebSocket 连接和音频流。
 *
 * @export
 * @class SpeechGateway
 * @typedef {SpeechGateway}
 * @implements {OnGatewayConnection}
 * @implements {OnGatewayDisconnect}
 */
@WebSocketGateway({
  namespace: 'speech',
  cors: {
    origin: '*', // 在生产环境应限制 origin
  },
})
export class SpeechGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SpeechGateway.name);
  // 存储每个连接的识别器实例
  private recognizers = new Map<string, vosk.Recognizer>();

  constructor(
    private readonly speechService: SpeechService,
    private readonly uxJwtService: UxJwtService,
  ) {}

  /**
   * 处理连接
   *
   * @param {Socket} client
   */
  async handleConnection(client: Socket) {
    this.logger.log(`Client connecting: ${client.id}`);

    // 鉴权
    const token = client.handshake.auth?.token || client.handshake.query?.token;

    if (!token) {
      this.logger.warn(`Client ${client.id} missing token`);
      client.disconnect();
      return;
    }

    try {
      // 验证 token
      const user = this.uxJwtService.parseLoginToken(token as string);
      client.data.user = user;
      this.logger.log(`Client ${client.id} authenticated as user ${user.id}`);
    } catch (error) {
      this.logger.warn(`Client ${client.id} invalid token: ${error.message}`);
      client.disconnect();
      return;
    }

    try {
      const rec = this.speechService.createRecognizer();
      this.recognizers.set(client.id, rec);
    } catch (error) {
      this.logger.error(
        `Failed to create recognizer for client ${client.id}`,
        error,
      );
      client.disconnect();
    }
  }

  /**
   * 处理断开连接
   *
   * @param {Socket} client
   */
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const rec = this.recognizers.get(client.id);
    if (rec) {
      rec.free();
      this.recognizers.delete(client.id);
    }
  }

  /**
   * 处理音频流
   *
   * @param {any} data 音频数据 (Buffer)
   * @param {Socket} client
   */
  @SubscribeMessage('audio-stream')
  handleAudio(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const rec = this.recognizers.get(client.id);
    if (!rec) {
      // 可能因为初始化失败或其他原因丢失
      return;
    }

    // data 应该是 Buffer
    if (rec.acceptWaveform(data)) {
      // 只有当有完整结果时才发送 result
      // console.log('rec.result()', rec.result());
      client.emit('recognition-result', rec.result());
    } else {
      // 返回部分结果 (partial result)
      // console.log('rec.partialResult()', rec.partialResult());
      client.emit('recognition-partial', rec.partialResult());
    }
  }

  /**
   * 停止识别 (可选，用于强制刷新最后的结果)
   *
   * @param {Socket} client
   */
  @SubscribeMessage('stop')
  handleStop(@ConnectedSocket() client: Socket) {
    const rec = this.recognizers.get(client.id);
    if (rec) {
      client.emit('recognition-result', rec.finalResult());
    }
  }
}

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as vosk from 'vosk';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 语音识别服务
 *
 * 负责加载 Vosk 模型并提供创建识别器的能力。
 *
 * @export
 * @class SpeechService
 * @typedef {SpeechService}
 * @implements {OnModuleInit}
 */
@Injectable()
export class SpeechService implements OnModuleInit {
  private model: vosk.Model;
  private readonly logger = new Logger(SpeechService.name);
  private readonly modelPath = path.join(
    process.cwd(),
    'contants',
    'models',
    'vosk-model-small-cn-0.22',
  );

  onModuleInit() {
    if (!fs.existsSync(this.modelPath)) {
      this.logger.error(`Vosk model not found at ${this.modelPath}`);
      return;
    }

    try {
      vosk.setLogLevel(-1); // 禁止 Vosk 内部日志
      this.model = new vosk.Model(this.modelPath);
      this.logger.log('Vosk model loaded successfully');
    } catch (error) {
      this.logger.error('Failed to load Vosk model', error);
    }
  }

  /**
   * 创建识别器
   *
   * @returns {vosk.Recognizer}
   */
  createRecognizer(): vosk.Recognizer {
    if (!this.model) {
      throw new Error('Model not loaded');
    }
    // 采样率通常为 16000
    return new vosk.Recognizer({ model: this.model, sampleRate: 16000 });
  }

  /**
   * 释放资源
   * 注意：通常 Model 在应用生命周期内常驻，不需要频繁释放。
   * 但 Recognizer 用完需要释放。
   */
  free() {
    if (this.model) {
      this.model.free();
    }
  }
}

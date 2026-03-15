import { Module } from '@nestjs/common';
import { SpeechGateway } from './speech.gateway';
import { SpeechService } from './speech.service';
import { UxJwtModule } from '@/modules/ux-jwt/ux-jwt.module';

/**
 * 语音识别模块
 *
 * @export
 * @class SpeechModule
 * @typedef {SpeechModule}
 */
@Module({
  imports: [UxJwtModule],
  providers: [SpeechGateway, SpeechService],
})
export class SpeechModule {}

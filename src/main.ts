import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { uniformResponseHeaderMiddleware } from './middleware/uniform-response-header/uniform-response-header.middleware';
import * as cookieParser from 'cookie-parser';
import { setupPlugins } from './plugins';
import { TransformResponseInterceptor } from './interceptors';

import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('api');
  setupPlugins(app);
  const configService = app.get(ConfigService);
  app.useGlobalInterceptors(new TransformResponseInterceptor(configService));
  // @ts-ignore
  app.use(cookieParser());
  app.use(uniformResponseHeaderMiddleware);
  await app.listen(process.env.PORT || 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();

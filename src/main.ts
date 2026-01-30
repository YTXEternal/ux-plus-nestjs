import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { uniformResponseHeaderMiddleware } from './middleware/uniform-response-header/uniform-response-header.middleware';
import * as cookieParser from 'cookie-parser';
import { setupPlugins } from './plugins';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  setupPlugins(app);
  app.use(cookieParser());
  app.use(uniformResponseHeaderMiddleware);
  await app.listen(process.env.PORT || 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();

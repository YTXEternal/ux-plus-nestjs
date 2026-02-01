import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

export const useSwagger = (app: INestApplication<any>) => {
  if (process.env.NODE_ENV === 'production') return;
  const options = new DocumentBuilder()
    .setTitle('nest-demo example')
    .setDescription('The nest demo API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  // 导出 Swagger JSON 文件到根目录
  fs.writeFileSync(
    path.resolve(process.cwd(), 'swagger.json'),
    JSON.stringify(document, null, 2),
  );

  SwaggerModule.setup('swagger', app, document);
};

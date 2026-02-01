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

  // -----------------------------------------------------------
  // 补全接口请求头配置
  // -----------------------------------------------------------
  Object.keys(document.paths).forEach((pathKey) => {
    const pathItem = document.paths[pathKey];
    Object.keys(pathItem).forEach((method) => {
      const operation = pathItem[method];
      if (!operation.parameters) {
        operation.parameters = [];
      }

      // 1. 全局添加 Content-Type: application/json
      const hasContentType = operation.parameters.some(
        (p: any) => p.name === 'Content-Type' && p.in === 'header',
      );
      if (!hasContentType) {
        operation.parameters.push({
          name: 'Content-Type',
          in: 'header',
          required: false,
          description: 'Content-Type',
          example: 'application/json',
        });
      }

      // 2. 非 auth 接口添加 Authorization: {{超级管理员token}}
      const isAuthRoute =
        pathKey.includes('/auth/') || pathKey.endsWith('/auth');

      if (!isAuthRoute) {
        const hasAuthorization = operation.parameters.some(
          (p: any) => p.name === 'Authorization' && p.in === 'header',
        );
        if (!hasAuthorization) {
          operation.parameters.push({
            name: 'Authorization',
            in: 'header',
            required: true,
            description: 'Authorization Token',
            example: '{{超级管理员token}}',
          });
        }
      }
    });
  });

  // 导出 Swagger JSON 文件到根目录
  fs.writeFileSync(
    path.resolve(process.cwd(), 'swagger.json'),
    JSON.stringify(document, null, 2),
  );

  SwaggerModule.setup('swagger', app, document);
};

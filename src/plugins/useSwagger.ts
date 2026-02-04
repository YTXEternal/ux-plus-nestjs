import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

export const useSwagger = (app: INestApplication<any>) => {
  if (process.env.NODE_ENV === 'production') return;
  const options = new DocumentBuilder()
    .setTitle('UX Plus NestJS API')
    .setDescription(
      '根据RESTful API软件设计风格并基于NestJS框架开发的一款后端开发模板，集成了数据库(Mysql，Mongodb)、缓存(Redis)、非对称算法RSA，实现了基本的身份验证守卫以及CPU过载保护。',
    )
    .setVersion('1.1.6')
    .setContact('ux_rcl', '', '')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'bearer',
        description: '输入 JWT Token',
        in: 'header',
      },
      'bearer', // 安全定义名称
    )
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

      // 2. 非 login 接口自动添加 Security Requirement
      const isAuthRoute =
        pathKey.includes('/auth/login') || pathKey.endsWith('/auth/login');

      if (!isAuthRoute) {
        if (!operation.security) {
          operation.security = [];
        }
        // 避免重复添加
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        const hasBearer = operation.security.some((s: any) => s.bearer);
        if (!hasBearer) {
          operation.security.push({ bearer: [] });
        }
      }
    });
  });

  // 导出 Swagger JSON 文件到根目录
  fs.writeFileSync(
    path.resolve(process.cwd(), 'swagger.json'),
    JSON.stringify(document, null, 2),
  );

  // 注入自定义 JS 实现 Token 选择器
  const customJs = `
    window.addEventListener('load', function () {
      // 在这里配置您的预设 Token
      const PRESET_TOKENS = {
        "示例管理员": "请在这里填入真实Token",
        "示例用户": "请在这里填入真实Token"
      };

      const interval = setInterval(() => {
        const topbar = document.querySelector('.topbar-wrapper .link');
        if (topbar) {
          clearInterval(interval);
          
          const container = document.createElement('div');
          container.style.display = 'flex';
          container.style.alignItems = 'center';
          container.style.marginLeft = '20px';

          const label = document.createElement('span');
          label.innerText = '快速填入Token：';
          label.style.color = '#fff';
          label.style.fontWeight = 'bold';
          label.style.marginRight = '8px';
          
          const select = document.createElement('select');
          select.style.padding = '4px 8px';
          select.style.borderRadius = '4px';
          select.style.border = 'none';
          select.style.cursor = 'pointer';
          
          const defaultOption = document.createElement('option');
          defaultOption.value = "";
          defaultOption.innerText = "选择 Token...";
          select.appendChild(defaultOption);

          Object.keys(PRESET_TOKENS).forEach(key => {
            const option = document.createElement('option');
            option.value = PRESET_TOKENS[key];
            option.innerText = key;
            select.appendChild(option);
          });

          select.onchange = (e) => {
            const token = e.target.value;
            if (!token) return;
            
            // 调用 Swagger UI 内部方法进行授权
            const authActions = window.ui.authActions;
            if (authActions) {
              authActions.authorize({
                bearer: {
                  name: 'bearer',
                  schema: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
                  value: token
                }
              });
            }
          };

          container.appendChild(label);
          container.appendChild(select);
          
          // 插入到 Logo 旁边
          topbar.parentNode.insertBefore(container, topbar.nextSibling);
        }
      }, 500);
    });
  `;

  const swaggerOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customJsStr: customJs,
  };

  SwaggerModule.setup('/', app, document, swaggerOptions);
};

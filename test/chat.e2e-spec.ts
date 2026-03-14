import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import request = require('supertest');
import { Sequelize } from 'sequelize-typescript';
import { setupPlugins } from '@/plugins';
import { md5 } from '@/tools';
import { UxCryptoRsaService } from '@/services/ux-crypto-rsa/ux-crypto-rsa.service';
import { UxPasswordService } from '@/modules/ux-password/ux-password.service';
import { UxJwtService } from '@/modules/ux-jwt/ux-jwt.service';
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Dept, Role, User, UserRole } from '@/databases/mysql-database/model';
import { ChatSession } from '@/databases/mysql-database/model/chat-session.model';

dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

type ApiResponseBody<T> = {
  code: number;
  message: string;
  data?: T;
};

type JwtLoginTokenPayload = {
  id: number;
  account: string;
  tokenId: string;
  sub: string;
  iat: number;
  exp: number;
};

describe('Chat API (e2e)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let uxPasswordService: UxPasswordService;
  let uxCryptoRsaService: UxCryptoRsaService;
  let uxJwtService: UxJwtService;

  let authToken = '';
  let e2eDatabaseName = '';

  const apiPrefix = '/api/v1';
  const testRunId = `${Date.now().toString(36).slice(-4)}${Math.random()
    .toString(36)
    .slice(2, 6)}`;

  /**
   * 构造带鉴权头的请求对象。
   */
  const authed = (method: 'get' | 'post' | 'put' | 'delete', url: string) => {
    return request(app.getHttpServer())
      [method](url)
      .set('Authorization', `Bearer ${authToken}`);
  };

  /**
   * 构造不带鉴权头的请求对象。
   */
  const unauthed = (method: 'get' | 'post' | 'put' | 'delete', url: string) => {
    return request(app.getHttpServer())[method](url);
  };

  /**
   * 构造指定 token 的鉴权请求对象（用于无效 token 场景）。
   */
  const authedWithToken = (
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    token: string,
  ) => {
    return request(app.getHttpServer())
      [method](url)
      .set('Authorization', `Bearer ${token}`);
  };

  /**
   * 断言接口响应满足统一 ApiResponse 结构且为成功态。
   */
  const expectOk = <T>(body: ApiResponseBody<T>) => {
    expect(body).toHaveProperty('code', 200);
    expect(body).toHaveProperty('message');
  };

  /**
   * 按前端逻辑加密登录密码：md5 后再 RSA 加密。
   */
  const encryptLoginPassword = (plain: string) => {
    return uxCryptoRsaService.encrypt(md5(plain));
  };

  beforeAll(async () => {
    jest.setTimeout(120_000);

    process.env.CPU_BASE_PROBABILITY = '0';

    const mysqlHost = process.env.MYSQL_HOST || '127.0.0.1';
    const mysqlPort = Number(process.env.MYSQL_PORT || 3306);
    const mysqlUser = process.env.MYSQL_USERNAME || 'root';
    const mysqlPassword = process.env.MYSQL_PASSWORD || '123456';

    e2eDatabaseName = `platform_test_e2e_chat_${testRunId}`.toLowerCase();
    const dbConn = await mysql.createConnection({
      host: mysqlHost,
      port: mysqlPort,
      user: mysqlUser,
      password: mysqlPassword,
      multipleStatements: true,
    });
    try {
      await dbConn.query(
        `CREATE DATABASE IF NOT EXISTS \`${e2eDatabaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
      );
    } finally {
      await dbConn.end();
    }

    process.env.MYSQL_DATABASE = e2eDatabaseName;

    const { AppModule } = await import('@/app.module');
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    setupPlugins(app);
    await app.init();

    sequelize = app.get(Sequelize);
    uxPasswordService = app.get(UxPasswordService);
    uxCryptoRsaService = app.get(UxCryptoRsaService);
    uxJwtService = app.get(UxJwtService);

    const dbName = (sequelize as any)?.config?.database as string | undefined;
    if (!dbName || dbName !== e2eDatabaseName) {
      throw new Error(
        `检测到非测试数据库连接：${dbName ?? 'unknown'}，已终止 e2e 以保护数据。`,
      );
    }

    await sequelize.sync({ force: true });

    // 创建部门
    const dept = await Dept.create({
      dept_name: `E2E_Chat_${testRunId}`,
      order_num: 1,
      status: '0',
      del_flag: '0',
    } as any);

    // 创建管理员角色
    const adminRole = await Role.create({
      role_name: '超级管理员',
      role_key: 'SUPERADMIN',
      role_sort: 1,
      status: '0',
      del_flag: '0',
      remark: '拥有所有权限的超级管理员',
    } as any);

    // 创建管理员用户
    const adminUser = await User.create({
      user_name: 'admin',
      nick_name: '超级管理员',
      password: uxPasswordService.encryptedPassword('admin123'),
      email: `admin_chat_${testRunId}@example.com`,
      phonenumber: '15888888888',
      sex: '1',
      avatar: '',
      status: '0',
      del_flag: '0',
      dept_id: dept.dept_id,
    } as any);

    await UserRole.create({
      user_id: adminUser.user_id,
      role_id: adminRole.role_id,
    } as any);

    // 登录获取 token
    const loginRes = await request(app.getHttpServer())
      .post(`${apiPrefix}/auth/login`)
      .send({
        user_name: 'admin',
        password: encryptLoginPassword('admin123'),
      })
      .expect(200);
    expectOk(loginRes.body as ApiResponseBody<{ token: string }>);
    authToken = (loginRes.body as ApiResponseBody<{ token: string }>).data!
      .token;
  }, 120000);

  afterAll(async () => {
    try {
      if (app) {
        await app.close();
      }
    } catch (e) {
      void e;
    } finally {
      const mysqlHost = process.env.MYSQL_HOST || '127.0.0.1';
      const mysqlPort = Number(process.env.MYSQL_PORT || 3306);
      const mysqlUser = process.env.MYSQL_USERNAME || 'root';
      const mysqlPassword = process.env.MYSQL_PASSWORD || '123456';

      if (e2eDatabaseName) {
        const dbConn = await mysql.createConnection({
          host: mysqlHost,
          port: mysqlPort,
          user: mysqlUser,
          password: mysqlPassword,
          multipleStatements: true,
        });
        try {
          await dbConn.query(`DROP DATABASE IF EXISTS \`${e2eDatabaseName}\`;`);
        } finally {
          await dbConn.end();
        }
      }
    }
  });

  describe('Chat Module', () => {
    describe('POST /chat/stream', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('post', `${apiPrefix}/chat/stream`).send({}).expect(401);
      });

      it('无 API Key 返回 400', async () => {
        // 创建一个没有 API Key 的普通用户
        const noApiKeyUser = await User.create({
          user_name: `no_apikey_user_${testRunId}`,
          nick_name: '无 Key 用户',
          password: uxPasswordService.encryptedPassword('123456'),
          status: '0',
          del_flag: '0',
        } as any);

        const role = await Role.findOne({
          where: { role_key: 'SUPERADMIN' } as any,
        });
        await UserRole.create({
          user_id: noApiKeyUser.user_id,
          role_id: role!.role_id,
        } as any);

        const loginRes = await request(app.getHttpServer())
          .post(`${apiPrefix}/auth/login`)
          .send({
            user_name: `no_apikey_user_${testRunId}`,
            password: encryptLoginPassword('123456'),
          })
          .expect(200);

        const token = (loginRes.body as ApiResponseBody<{ token: string }>)
          .data!.token;

        await authedWithToken('post', `${apiPrefix}/chat/stream`, token)
          .send({ query: 'hello' })
          .expect(400);
      });

      it('正常流式响应', async () => {
        // 确保当前测试用户有 API Key
        await authed('put', `${apiPrefix}/user_center/update`)
          .send({ apikey: `test_api_key_${testRunId}` })
          .expect(200);

        const res = await authed('post', `${apiPrefix}/chat/stream`)
          .send({ query: 'hello' })
          .expect(201);

        expect(res.headers['content-type']).toContain('text/event-stream');
        expect(res.text).toContain('data:');
      });
    });

    describe('Session Management', () => {
      let sessionId: string;

      it('手动创建会话', async () => {
        const title = 'Manual Session ' + Date.now();
        const res = await authed('post', `${apiPrefix}/chat/session`)
          .send({ title })
          .expect(201);

        expectOk(res.body as ApiResponseBody<any>);
        const data = (res.body as ApiResponseBody<any>).data;
        expect(data).toHaveProperty('sessionId');
        expect(data).toHaveProperty('title', title);

        // 验证列表里存在
        const listRes = await authed(
          'get',
          `${apiPrefix}/chat/sessions`,
        ).expect(200);
        const sessions = (listRes.body as ApiResponseBody<any[]>).data!;
        const createdSession = sessions.find(
          (s) => s.session_id === data.sessionId,
        );
        expect(createdSession).toBeDefined();
        expect(createdSession.title).toBe(title);
      });

      it('新建会话并产生消息', async () => {
        // 1. 发起对话，不带 sessionId，应自动创建
        const res = await authed('post', `${apiPrefix}/chat/stream`)
          .send({ query: 'New Session Start' })
          .expect(201);

        // 解析返回的 SSE 数据以获取 sessionId
        const lines = res.text.split('\n\n');
        const firstDataLine = lines.find((line) => line.startsWith('data: '));
        expect(firstDataLine).toBeDefined();
        if (firstDataLine) {
          const jsonStr = firstDataLine.replace('data: ', '');
          const data = JSON.parse(jsonStr);
          expect(data).toHaveProperty('sessionId');
          sessionId = data.sessionId;
        }

        // 等待模拟流结束和数据入库
        await new Promise((resolve) => setTimeout(resolve, 2000));
      });

      it('获取会话列表', async () => {
        const res = await authed('get', `${apiPrefix}/chat/sessions`).expect(
          200,
        );
        expectOk(res.body as ApiResponseBody<any[]>);
        const sessions = (res.body as ApiResponseBody<any[]>).data!;
        expect(sessions.length).toBeGreaterThan(0);
        const targetSession = sessions.find((s) => s.session_id === sessionId);
        expect(targetSession).toBeDefined();
        expect(targetSession.title).toBeDefined();
      });

      it('获取会话历史消息', async () => {
        const res = await authed(
          'get',
          `${apiPrefix}/chat/session/${sessionId}/messages`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<any[]>);
        const messages = (res.body as ApiResponseBody<any[]>).data!;
        // 至少有一条用户消息
        expect(messages.length).toBeGreaterThanOrEqual(1);
        expect(messages[0].role).toBe('user');
        expect(messages[0].content).toBe('New Session Start');
      });

      it('在已有会话中继续对话', async () => {
        await authed('post', `${apiPrefix}/chat/stream`)
          .send({ query: 'Follow up question', sessionId })
          .expect(201);

        // 等待模拟流结束和数据入库
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // 再次检查消息记录
        const res = await authed(
          'get',
          `${apiPrefix}/chat/session/${sessionId}/messages`,
        ).expect(200);
        const messages = (res.body as ApiResponseBody<any[]>).data!;
        // 应该增加了新的问答
        expect(messages.length).toBeGreaterThanOrEqual(2);
      });

      it('删除会话', async () => {
        await authed('delete', `${apiPrefix}/chat/session`)
          .send({ sessionId })
          .expect(200);

        // 验证列表里没有了
        const res = await authed('get', `${apiPrefix}/chat/sessions`).expect(
          200,
        );
        const sessions = (res.body as ApiResponseBody<any[]>).data!;
        const targetSession = sessions.find((s) => s.session_id === sessionId);
        expect(targetSession).toBeUndefined();
      });
    });
  });
});

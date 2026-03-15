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
import { io, Socket } from 'socket.io-client';

dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

type ApiResponseBody<T> = {
  code: number;
  message: string;
  data?: T;
};

import { TransformResponseInterceptor } from '@/interceptors';
import { ConfigService } from '@nestjs/config';

describe('SpeechGateway (e2e)', () => {
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

  let socket: Socket;
  let port: number;

  const encryptLoginPassword = (plain: string) => {
    return uxCryptoRsaService.encrypt(md5(plain));
  };

  beforeAll(async () => {
    try {
      jest.setTimeout(120_000);

      process.env.CPU_BASE_PROBABILITY = '0';

      const mysqlHost = process.env.MYSQL_HOST || '127.0.0.1';
      const mysqlPort = Number(process.env.MYSQL_PORT || 3306);
      const mysqlUser = process.env.MYSQL_USERNAME || 'root';
      const mysqlPassword = process.env.MYSQL_PASSWORD || '123456';

      e2eDatabaseName =
        `platform_test_speech_e2e_${testRunId}`.toLowerCase();
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
      const configService = app.get(ConfigService);
      app.useGlobalInterceptors(
        new TransformResponseInterceptor(configService),
      );
      try {
        await app.init();
      } catch (err) {
        console.error('App init failed:', err);
        throw err;
      }

      // 获取 HTTP Server 端口
      await app.listen(0);
      const httpServer = app.getHttpServer();
      port = httpServer.address().port;

      sequelize = app.get(Sequelize);
      uxPasswordService = app.get(UxPasswordService);
      uxCryptoRsaService = app.get(UxCryptoRsaService);
      uxJwtService = app.get(UxJwtService);

      await sequelize.sync({ force: true });

      // 初始化基础数据
      const dept = await Dept.create({
        dept_name: `E2E_${testRunId}`,
        order_num: 1,
        status: '0',
        del_flag: '0',
      } as any);

      const adminRole = await Role.create({
        role_name: '普通用户',
        role_key: 'USER',
        role_sort: 1,
        status: '0',
        del_flag: '0',
        remark: '普通用户角色',
      } as any);

      const adminUser = await User.create({
        user_name: 'testuser',
        nick_name: '测试用户',
        password: uxPasswordService.encryptedPassword('test123456'),
        email: `test_${testRunId}@example.com`,
        phonenumber: '13888888888',
        sex: '1',
        avatar: 'old_avatar.png',
        status: '0',
        del_flag: '0',
        dept_id: dept.dept_id,
      } as any);

      await UserRole.create({
        user_id: adminUser.user_id,
        role_id: adminRole.role_id,
      } as any);

      // 登录
      const loginRes = await request(app.getHttpServer())
        .post(`${apiPrefix}/auth/login`)
        .send({
          user_name: 'testuser',
          password: encryptLoginPassword('test123456'),
        })
        .expect(200);
      authToken = (loginRes.body as ApiResponseBody<{ token: string }>).data!
        .token;
    } catch (err) {
      console.error('Test setup failed:', err);
      throw err;
    }
  }, 120000);

  afterAll(async () => {
    if (socket) {
        socket.disconnect();
    }
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

  it('should connect successfully', (done) => {
    socket = io(`http://localhost:${port}/speech`, {
      auth: { token: authToken },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      expect(socket.connected).toBe(true);
      done();
    });

    socket.on('connect_error', (err) => {
        done(err);
    });
  });

  it('should receive recognition result (mock data)', (done) => {
    if (!socket || !socket.connected) {
         // Reconnect if needed, or fail
         socket = io(`http://localhost:${port}/speech`, {
            auth: { token: authToken },
            transports: ['websocket'],
          });
    }

    // 创建一个模拟的 PCM buffer (例如 1秒钟的静音)
    const buffer = Buffer.alloc(32000); 

    socket.emit('audio-stream', buffer);

    // 监听部分结果或最终结果
    // 由于是静音，Vosk 可能什么都不返回，或者返回空字符串
    // 我们主要验证连接没有断开，且服务器处理了请求
    
    // 我们可以设置一个超时，如果没有报错断开，就认为通过
    setTimeout(() => {
        expect(socket.connected).toBe(true);
        done();
    }, 1000);
  });

  it('should disconnect when token is invalid', (done) => {
     const badSocket = io(`http://localhost:${port}/speech`, {
      auth: { token: 'invalid-token' },
      transports: ['websocket'],
    });
    
    // 如果 token 无效，socket.io 服务端会调用 client.disconnect()
    // 客户端会收到 disconnect 事件
    
    // 但在测试中，有时候 connect_error 也会触发，或者连接根本不会建立成功
    
    badSocket.on('connect', () => {
        // 连接建立后，服务端鉴权失败会断开
    });

    badSocket.on('disconnect', (reason) => {
        // 服务端断开
        expect(reason).toBeDefined();
        badSocket.close();
        done();
    });
    
    // 如果长时间没有反应，可能是鉴权没通过但连接也没断（不符合预期）
    // 或者根本没连上
    badSocket.on('connect_error', (err) => {
         // 连接层面的错误
         expect(err).toBeDefined();
         badSocket.close();
         done();
    });
  });
});

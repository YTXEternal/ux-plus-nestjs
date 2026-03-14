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

dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

type ApiResponseBody<T> = {
  code: number;
  message: string;
  data?: T;
};

import { TransformResponseInterceptor } from '@/interceptors';
import { ConfigService } from '@nestjs/config';

describe('User Center API (e2e)', () => {
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

  const created = {
    deptId: 0,
    roleId: 0,
    adminUserId: 0,
  };

  const authed = (method: 'get' | 'post' | 'put' | 'delete', url: string) => {
    return request(app.getHttpServer())
      [method](url)
      .set('Authorization', `Bearer ${authToken}`);
  };

  const expectOk = <T>(body: ApiResponseBody<T>) => {
    expect(body).toHaveProperty('code', 200);
    expect(body).toHaveProperty('message');
  };

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
        `platform_test_user_center_e2e_${testRunId}`.toLowerCase();
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
      created.deptId = dept.dept_id;

      const adminRole = await Role.create({
        role_name: '普通用户',
        role_key: 'USER',
        role_sort: 1,
        status: '0',
        del_flag: '0',
        remark: '普通用户角色',
      } as any);
      created.roleId = adminRole.role_id;

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
        dept_id: created.deptId,
      } as any);
      created.adminUserId = adminUser.user_id;

      await UserRole.create({
        user_id: created.adminUserId,
        role_id: created.roleId,
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

  describe('User Center profile info', () => {
    it('Sanity check', () => {
      expect(true).toBe(true);
    });

    it('获取个人信息成功', async () => {
      const res = await authed('get', `${apiPrefix}/user_center/detail`).expect(
        200,
      );

      expectOk(res.body as ApiResponseBody<any>);
      const data = (res.body as ApiResponseBody<any>).data;

      expect(data).toHaveProperty('nick_name', '测试用户');
      expect(data).toHaveProperty('email', `test_${testRunId}@example.com`);
      expect(data).toHaveProperty('phonenumber', '13888888888');
      expect(data).toHaveProperty('sex', '1');
      expect(data).toHaveProperty('avatar', 'old_avatar.png');
    });

    it('修改个人信息成功', async () => {
      const updateData = {
        nick_name: '更新后的测试用户',
        email: 'updated@example.com',
        phonenumber: '15999999999',
        sex: '0',
        avatar: 'new_avatar.png',
      };

      const res = await authed('put', `${apiPrefix}/user_center/update`)
        .send(updateData)
        .expect(200);

      expectOk(res.body as ApiResponseBody<any>);

      // Fetch again to verify updates
      const fetchRes = await authed(
        'get',
        `${apiPrefix}/user_center/detail`,
      ).expect(200);

      const data = (fetchRes.body as ApiResponseBody<any>).data;

      expect(data).toHaveProperty('nick_name', '更新后的测试用户');
      expect(data).toHaveProperty('email', 'updated@example.com');
      expect(data).toHaveProperty('phonenumber', '15999999999');
      expect(data).toHaveProperty('sex', '0');
      expect(data).toHaveProperty('avatar', 'new_avatar.png');
    });
  });
});

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
import {
  SysDept,
  SysRole,
  SysUser,
  SysUserRole,
} from '@/databases/mysql-database/model';
import { HomeStatistics } from '@/databases/mysql-database/model/home-statistics.model';

dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

type ApiResponseBody<T> = {
  code: number;
  message: string;
  data?: T;
};

import { TransformResponseInterceptor } from '@/interceptors';
import { ConfigService } from '@nestjs/config';

describe('Home API (e2e)', () => {
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

      e2eDatabaseName = `platform_test_home_e2e_${testRunId}`.toLowerCase();
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
      const dept = await SysDept.create({
        dept_name: `E2E_${testRunId}`,
        order_num: 1,
        status: '0',
        del_flag: '0',
      } as any);
      created.deptId = dept.dept_id;

      const adminRole = await SysRole.create({
        role_name: '超级管理员',
        role_key: 'SUPERADMIN',
        role_sort: 1,
        status: '0',
        del_flag: '0',
        remark: '拥有所有权限的超级管理员',
      } as any);
      created.roleId = adminRole.role_id;

      const adminUser = await SysUser.create({
        user_name: 'admin',
        nick_name: '超级管理员',
        password: uxPasswordService.encryptedPassword('admin123'),
        email: `admin_${testRunId}@example.com`,
        phonenumber: '15888888888',
        sex: '1',
        avatar: '',
        status: '0',
        del_flag: '0',
        dept_id: created.deptId,
      } as any);
      created.adminUserId = adminUser.user_id;

      await SysUserRole.create({
        user_id: created.adminUserId,
        role_id: created.roleId,
      } as any);

      // 登录
      const loginRes = await request(app.getHttpServer())
        .post(`${apiPrefix}/auth/login`)
        .send({
          user_name: 'admin',
          password: encryptLoginPassword('admin123'),
        })
        .expect(200);
      authToken = (loginRes.body as ApiResponseBody<{ token: string }>).data!
        .token;

      // 初始化 HomeStatistics 数据
      try {
        const shopId = 1001;
        const HomeStatsModel = app.get(Sequelize).models.HomeStatistics;
        if (!HomeStatsModel) {
          throw new Error(
            'HomeStatistics model not found in Sequelize instance',
          );
        }
        
        // 注意：新逻辑下 stats_time 通常只存日期 'YYYY-MM-DD'
        // 这里模拟插入几天的数据
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        await HomeStatsModel.bulkCreate([
          {
            shop_id: shopId,
            stats_time: yesterday,
            member_growth: 10,
            ticket_sales: 1000.0,
            refund_amount: 0,
            refund_count: 0,
          },
          {
            shop_id: shopId,
            stats_time: today,
            member_growth: 5,
            ticket_sales: 500.0,
            refund_amount: 100.0,
            refund_count: 1,
          },
          {
            shop_id: 1002, // 另一个店铺
            stats_time: yesterday,
            member_growth: 2,
            ticket_sales: 200.0,
            refund_amount: 0,
            refund_count: 0,
          },
        ] as any);
      } catch (error) {
        console.error('Failed to init HomeStatistics data:', error);
        throw error;
      }
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

  describe('Home Statistics', () => {
    const shopId = 1001;

    it('Sanity check', () => {
      expect(true).toBe(true);
    });

    it('获取统计数据成功 (7天)', async () => {
      const res = await authed('get', `${apiPrefix}/home/statistics`)
        .query({
          shop_id: shopId,
          days: 7
        })
        .expect(200);

      expectOk(res.body as ApiResponseBody<any>);
      const data = (res.body as ApiResponseBody<any>).data;

      expect(data).toHaveProperty('xAxis');
      expect(data).toHaveProperty('series');
      // days=7, 应该返回7天的数据
      expect(data.xAxis.data.length).toBe(7);
      
      // 验证最后两天的数据（我们只插了两天）
      const len = data.series[0].data.length;
      const lastTwoMemberGrowth = data.series[0].data.slice(len - 2).map(Number);
      // 昨天 10，今天 5
      expect(lastTwoMemberGrowth).toEqual([10, 5]);
    });

    it('不传 shop_id 应汇总所有店铺数据', async () => {
      const res = await authed('get', `${apiPrefix}/home/statistics`)
        .query({
          days: 7
        })
        .expect(200);

      expectOk(res.body as ApiResponseBody<any>);
      const data = (res.body as ApiResponseBody<any>).data;

      expect(data.xAxis.data.length).toBe(7);

      const len = data.series[0].data.length;
      const lastTwoMemberGrowth = data.series[0].data.slice(len - 2).map(Number);
      // 昨天: 10 + 2 = 12
      // 今天: 5
      expect(lastTwoMemberGrowth).toEqual([12, 5]);
    });
  });
});

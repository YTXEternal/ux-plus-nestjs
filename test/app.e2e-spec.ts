import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
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
  SysConfig,
  SysDept,
  SysDictData,
  SysDictType,
  SysLogininfor,
  SysMenu,
  SysNotice,
  SysOperLog,
  SysPost,
  SysRole,
  SysUser,
  SysUserRole,
} from '@/databases/mysql-database/model';

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

describe('API (e2e)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let uxPasswordService: UxPasswordService;
  let uxCryptoRsaService: UxCryptoRsaService;
  let uxJwtService: UxJwtService;

  let authToken = '';
  let tokenId = '';
  let e2eDatabaseName = '';

  const apiPrefix = '/api/v1';
  const testRunId = `${Date.now().toString(36).slice(-4)}${Math.random()
    .toString(36)
    .slice(2, 6)}`;

  const created = {
    deptId: 0,
    roleId: 0,
    adminUserId: 0,
    configId: 0,
    dictTypeId: 0,
    dictDataCode: 0,
    menuId: 0,
    noticeId: 0,
    postId: 0,
    roleCrudId: 0,
    userCrudId: 0,
    operId: 0,
    loginInfoId: 0,
  };

  /**
   * 构造带鉴权头的请求对象。
   *
   * @param {string} method HTTP 方法
   * @param {string} url 接口路径（含 /api/v1）
   */
  const authed = (method: 'get' | 'post' | 'put' | 'delete', url: string) => {
    return request(app.getHttpServer())
      [method](url)
      .set('Authorization', `Bearer ${authToken}`);
  };

  /**
   * 构造不带鉴权头的请求对象。
   *
   * @param {string} method HTTP 方法
   * @param {string} url 接口路径（含 /api/v1）
   */
  const unauthed = (method: 'get' | 'post' | 'put' | 'delete', url: string) => {
    return request(app.getHttpServer())[method](url);
  };

  /**
   * 构造指定 token 的鉴权请求对象（用于无效 token 场景）。
   *
   * @param {string} method HTTP 方法
   * @param {string} url 接口路径（含 /api/v1）
   * @param {string} token 登录 token
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
   *
   * @template T
   * @param {ApiResponseBody<T>} body 响应体
   */
  const expectOk = <T>(body: ApiResponseBody<T>) => {
    expect(body).toHaveProperty('code', 200);
    expect(body).toHaveProperty('message');
  };

  /**
   * 按前端逻辑加密登录密码：md5 后再 RSA 加密。
   *
   * @param {string} plain 明文密码
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

    e2eDatabaseName = `platform_test_e2e_${testRunId}`.toLowerCase();
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

    let dept: SysDept;
    try {
      dept = await SysDept.create({
        dept_name: `E2E_${testRunId}`,
        order_num: 1,
        status: '0',
        del_flag: '0',
      } as any);
    } catch (e) {
      const err = e;
      const msg =
        err?.original?.sqlMessage ||
        err?.original?.message ||
        err?.message ||
        String(err);
      throw new Error(`SysDept.create 失败：${msg}`);
    }
    created.deptId = dept.dept_id;

    const adminRole =
      (await SysRole.findOne({
        where: { role_key: 'SUPERADMIN' } as any,
      })) ||
      (await SysRole.create({
        role_name: '超级管理员',
        role_key: 'SUPERADMIN',
        role_sort: 1,
        status: '0',
        del_flag: '0',
        remark: '拥有所有权限的超级管理员',
      } as any));
    created.roleId = adminRole.role_id;

    const adminUser =
      (await SysUser.findOne({
        where: { user_name: 'admin' } as any,
      })) ||
      (await SysUser.create({
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
      } as any));
    created.adminUserId = adminUser.user_id;

    const linkExists = await SysUserRole.findOne({
      where: { user_id: created.adminUserId, role_id: created.roleId } as any,
    });
    if (!linkExists) {
      await SysUserRole.create({
        user_id: created.adminUserId,
        role_id: created.roleId,
      } as any);
    }

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
    const parsed = uxJwtService.parseLoginToken(authToken);
    const payload = parsed as unknown as JwtLoginTokenPayload;
    tokenId = payload.tokenId;
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

  const invalidToken = 'invalid.token.value';

  describe('Auth', () => {
    describe('GET /auth/public-key', () => {
      it('获取公钥成功', async () => {
        const res = await unauthed(
          'get',
          `${apiPrefix}/auth/public-key`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<{ publicKey: string }>);
        const data = (res.body as ApiResponseBody<{ publicKey: string }>).data!;
        expect(data.publicKey).toContain('-----BEGIN PUBLIC KEY-----');
      });
    });

    describe('POST /auth/login', () => {
      it('未传 password 返回 400', async () => {
        await request(app.getHttpServer())
          .post(`${apiPrefix}/auth/login`)
          .send({ user_name: 'admin' })
          .expect(400);
      });

      it('密码错误返回 400', async () => {
        await request(app.getHttpServer())
          .post(`${apiPrefix}/auth/login`)
          .send({
            user_name: 'admin',
            password: encryptLoginPassword('wrongpassword'),
          })
          .expect(400);
      });

      it('登录成功返回 token', async () => {
        const response = await request(app.getHttpServer())
          .post(`${apiPrefix}/auth/login`)
          .send({
            user_name: 'admin',
            password: encryptLoginPassword('admin123'),
          })
          .expect(200);

        expectOk(
          response.body as ApiResponseBody<{
            token: string;
            refreshToken: string;
          }>,
        );
        const data = (
          response.body as ApiResponseBody<{
            token: string;
            refreshToken: string;
          }>
        ).data!;
        expect(typeof data.token).toBe('string');
        expect(typeof data.refreshToken).toBe('string');
      });
    });

    describe('POST /auth/refresh', () => {
      it('未传 refreshToken 返回 400', async () => {
        await request(app.getHttpServer())
          .post(`${apiPrefix}/auth/refresh`)
          .send({})
          .expect(400);
      });

      it('无效 refreshToken 返回 401', async () => {
        await request(app.getHttpServer())
          .post(`${apiPrefix}/auth/refresh`)
          .send({ refreshToken: 'invalid_token' })
          .expect(401);
      });

      it('刷新成功', async () => {
        // 1. 先登录获取 refreshToken
        const loginRes = await request(app.getHttpServer())
          .post(`${apiPrefix}/auth/login`)
          .send({
            user_name: 'admin',
            password: encryptLoginPassword('admin123'),
          })
          .expect(200);

        const refreshToken = (
          loginRes.body as ApiResponseBody<{ refreshToken: string }>
        ).data!.refreshToken;

        expect(typeof refreshToken).toBe('string');
        const testToken =
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWNjb3VudCI6ImFkbWluIiwidG9rZW5JZCI6Ijg1ZDc5NTRhLWU1ZjAtNDBmYy1hY2ZjLWFiMDViM2Y2NmFjNiIsImlhdCI6MTc2OTk5NDQ4OCwiZXhwIjoxNzcyNTg2NDg4LCJzdWIiOiJuZXN0anMtdG9rZW4ifQ.DfHYelcxFIrQnYLFssWT6bQn1Vs5JiXorkuKTHmZIkyYDuQbqDX-I0h_Y14_GHO92D_8aclHccculkZfbmZSlnfQ_pz33RKEmDV_xQHrHV5XRyEy9mUiH5YUFyMj1UhnEIlOM-Y_c3mp_DEv0k8fN7wNYEXdSwe_VV4nq6bGCuaejw4ggrhXheKtDAx_EcMN7YXgXiWstzsBX6ctO-bX_JBxQkoj6okm-EkkkgNCl_vBcY6-hzsF6vYpe_qawQWt24RRiuronqeT28dIFCVgoPRVcIYbnHGkTs-eKb-sQ9QStvyiWV1kB_vtVdt9S41h9gFrxPmJPohWTJGOxRaIVQ';

        // 2. 使用 refreshToken 刷新
        const refreshRes = await request(app.getHttpServer())
          .post(`${apiPrefix}/auth/refresh`)
          .send({ refreshToken: `Bearer ${refreshToken}` })
          .expect(200);

        expectOk(refreshRes.body as ApiResponseBody<{ token: string }>);
        const newToken = (refreshRes.body as ApiResponseBody<{ token: string }>)
          .data!.token;
        expect(typeof newToken).toBe('string');

        // 3. 验证新 token 可用
        await authedWithToken('get', `${apiPrefix}/auth/info`, newToken).expect(
          200,
        );
      });
    });

    describe('GET /auth/info', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('get', `${apiPrefix}/auth/info`).expect(401);
      });

      it('访问成功', async () => {
        const res = await authed('get', `${apiPrefix}/auth/info`).expect(200);
        expectOk(res.body as ApiResponseBody<any>);
        const data = (res.body as ApiResponseBody<any>).data;
        expect(data).toHaveProperty('user');
        expect(data).toHaveProperty('roles');
        expect(data).toHaveProperty('permissions');
        expect(data.user.user_name).toBe('admin');
      });

      it('普通用户访问成功', async () => {
        // 创建普通角色
        const normalRole = await SysRole.create({
          role_name: '普通角色',
          role_key: 'NORMAL',
          role_sort: 2,
          status: '0',
          del_flag: '0',
        } as any);

        // 创建普通用户
        const normalUser = await SysUser.create({
          user_name: 'normal_user',
          nick_name: '普通用户',
          password: uxPasswordService.encryptedPassword('123456'),
          status: '0',
          del_flag: '0',
        } as any);

        // 关联角色
        await SysUserRole.create({
          user_id: normalUser.user_id,
          role_id: normalRole.role_id,
        } as any);

        // 登录
        const loginRes = await request(app.getHttpServer())
          .post(`${apiPrefix}/auth/login`)
          .send({
            user_name: 'normal_user',
            password: encryptLoginPassword('123456'),
          })
          .expect(200);

        const token = (loginRes.body as ApiResponseBody<{ token: string }>)
          .data!.token;

        // 获取 info
        const res = await authedWithToken(
          'get',
          `${apiPrefix}/auth/info`,
          token,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<any>);
        const data = (res.body as ApiResponseBody<any>).data;
        expect(data.user.user_name).toBe('normal_user');
        expect(data.roles).toContain('NORMAL');
      });
    });

    describe('GET /route/getReactUserRoutes', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('get', `${apiPrefix}/route/getReactUserRoutes`).expect(
          401,
        );
      });

      it('访问成功', async () => {
        const res = await authed(
          'get',
          `${apiPrefix}/route/getReactUserRoutes`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<any>);
        const data = (res.body as ApiResponseBody<any>).data;
        expect(Array.isArray(data.routes)).toBe(true);
      });
    });
  });

  describe('System - Config', () => {
    const configKey = `e2e.key.${testRunId}`;

    describe('POST /system/config', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('post', `${apiPrefix}/system/config`)
          .send({})
          .expect(401);
      });

      it('缺少字段返回 400', async () => {
        await authed('post', `${apiPrefix}/system/config`)
          .send({ config_name: `E2E参数_${testRunId}` })
          .expect(400);
      });

      it('创建成功返回 201', async () => {
        const res = await authed('post', `${apiPrefix}/system/config`)
          .send({
            config_name: `E2E参数_${testRunId}`,
            config_key: configKey,
            config_value: 'v1',
            config_type: 'N',
            remark: 'e2e',
          })
          .expect(201);
        expectOk(res.body as ApiResponseBody<SysConfig>);
        created.configId = (
          res.body as ApiResponseBody<SysConfig>
        ).data!.config_id;
      });
    });

    describe('GET /system/config/list', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed(
          'get',
          `${apiPrefix}/system/config/list?pageNum=1&pageSize=10`,
        ).expect(401);
      });

      it('访问成功', async () => {
        const res = await authed(
          'get',
          `${apiPrefix}/system/config/list?pageNum=1&pageSize=10&config_key=${configKey}`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<any>);
      });
    });

    describe('GET /system/config/:configId', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('get', `${apiPrefix}/system/config/1`).expect(401);
      });

      it('访问成功', async () => {
        const res = await authed(
          'get',
          `${apiPrefix}/system/config/${created.configId}`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<SysConfig>);
      });
    });

    describe('GET /system/config/configKey/:configKey', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed(
          'get',
          `${apiPrefix}/system/config/configKey/${configKey}`,
        ).expect(401);
      });

      it('访问成功', async () => {
        const res = await authed(
          'get',
          `${apiPrefix}/system/config/configKey/${configKey}`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<SysConfig>);
      });
    });

    describe('PUT /system/config', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('put', `${apiPrefix}/system/config`)
          .send({})
          .expect(401);
      });

      it('缺少字段返回 400', async () => {
        await authed('put', `${apiPrefix}/system/config`)
          .send({ config_id: created.configId })
          .expect(400);
      });

      it('更新成功', async () => {
        const res = await authed('put', `${apiPrefix}/system/config`)
          .send({
            config_id: created.configId,
            config_name: `E2E参数_${testRunId}`,
            config_key: configKey,
            config_value: 'v2',
            config_type: 'N',
            remark: 'e2e2',
          })
          .expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });

    describe('DELETE /system/config', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('delete', `${apiPrefix}/system/config`)
          .send({ config_ids: [created.configId] })
          .expect(401);
      });

      it('缺少 config_ids 返回 400', async () => {
        await authed('delete', `${apiPrefix}/system/config`)
          .send({})
          .expect(400);
      });

      it('删除成功', async () => {
        const res = await authed('delete', `${apiPrefix}/system/config`)
          .send({ config_ids: [created.configId] })
          .expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });
  });

  describe('System - Dept', () => {
    let deptCrudId = 0;

    describe('POST /system/dept', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('post', `${apiPrefix}/system/dept`).send({}).expect(401);
      });

      it('缺少字段返回 400', async () => {
        await authed('post', `${apiPrefix}/system/dept`)
          .send({ dept_name: `E2E部门CRUD_${testRunId}` })
          .expect(400);
      });

      it('创建成功返回 201', async () => {
        const res = await authed('post', `${apiPrefix}/system/dept`)
          .send({
            dept_name: `E2E部门CRUD_${testRunId}`,
            order_num: 2,
            status: '0',
          })
          .expect(201);
        expectOk(res.body as ApiResponseBody<SysDept>);
        deptCrudId = (res.body as ApiResponseBody<SysDept>).data!.dept_id;
      });
    });

    describe('GET /system/dept/list', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed(
          'get',
          `${apiPrefix}/system/dept/list?dept_name=E2E部门CRUD_${testRunId}`,
        ).expect(401);
      });

      it('访问成功', async () => {
        const res = await authed(
          'get',
          `${apiPrefix}/system/dept/list?dept_name=E2E部门CRUD_${testRunId}`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });

    describe('GET /system/dept/:deptId', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('get', `${apiPrefix}/system/dept/${deptCrudId}`).expect(
          401,
        );
      });

      it('访问成功', async () => {
        const res = await authed(
          'get',
          `${apiPrefix}/system/dept/${deptCrudId}`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<SysDept>);
      });
    });

    describe('PUT /system/dept', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('put', `${apiPrefix}/system/dept`).send({}).expect(401);
      });

      it('缺少字段返回 400', async () => {
        await authed('put', `${apiPrefix}/system/dept`)
          .send({ dept_id: deptCrudId })
          .expect(400);
      });

      it('更新成功', async () => {
        const res = await authed('put', `${apiPrefix}/system/dept`)
          .send({
            dept_id: deptCrudId,
            dept_name: `E2E部门CRUD_${testRunId}_2`,
            order_num: 3,
            status: '0',
          })
          .expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });

    describe('DELETE /system/dept', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('delete', `${apiPrefix}/system/dept`)
          .send({ dept_id: deptCrudId })
          .expect(401);
      });

      it('缺少 dept_id 返回 400', async () => {
        await authed('delete', `${apiPrefix}/system/dept`).send({}).expect(400);
      });

      it('删除成功', async () => {
        const res = await authed('delete', `${apiPrefix}/system/dept`)
          .send({ dept_id: deptCrudId })
          .expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });
  });

  describe('System - Post', () => {
    const postCode = `e2e_${testRunId}`;

    describe('POST /system/post', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('post', `${apiPrefix}/system/post`).send({}).expect(401);
      });

      it('缺少字段返回 400', async () => {
        await authed('post', `${apiPrefix}/system/post`)
          .send({ post_name: `E2E岗位_${testRunId}` })
          .expect(400);
      });

      it('创建成功返回 201', async () => {
        const res = await authed('post', `${apiPrefix}/system/post`)
          .send({
            post_code: postCode,
            post_name: `E2E岗位_${testRunId}`,
            post_sort: 1,
            status: '0',
            remark: 'e2e',
          })
          .expect(201);
        expectOk(res.body as ApiResponseBody<SysPost>);
        created.postId = (res.body as ApiResponseBody<SysPost>).data!.post_id;
      });
    });

    describe('GET /system/post/list', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed(
          'get',
          `${apiPrefix}/system/post/list?pageNum=1&pageSize=10&post_code=${postCode}`,
        ).expect(401);
      });

      it('访问成功', async () => {
        const res = await authed(
          'get',
          `${apiPrefix}/system/post/list?pageNum=1&pageSize=10&post_code=${postCode}`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<any>);
      });
    });

    describe('GET /system/post/:postId', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed(
          'get',
          `${apiPrefix}/system/post/${created.postId}`,
        ).expect(401);
      });

      it('访问成功', async () => {
        const res = await authed(
          'get',
          `${apiPrefix}/system/post/${created.postId}`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<SysPost>);
      });
    });

    describe('PUT /system/post', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('put', `${apiPrefix}/system/post`).send({}).expect(401);
      });

      it('缺少字段返回 400', async () => {
        await authed('put', `${apiPrefix}/system/post`)
          .send({ post_id: created.postId })
          .expect(400);
      });

      it('更新成功', async () => {
        const res = await authed('put', `${apiPrefix}/system/post`)
          .send({
            post_id: created.postId,
            post_code: postCode,
            post_name: `E2E岗位_${testRunId}_2`,
            post_sort: 2,
            status: '0',
            remark: 'e2e2',
          })
          .expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });

    describe('DELETE /system/post', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('delete', `${apiPrefix}/system/post`)
          .send({ post_ids: [created.postId] })
          .expect(401);
      });

      it('缺少 post_ids 返回 400', async () => {
        await authed('delete', `${apiPrefix}/system/post`).send({}).expect(400);
      });

      it('删除成功', async () => {
        const res = await authed('delete', `${apiPrefix}/system/post`)
          .send({ post_ids: [created.postId] })
          .expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });
  });

  describe('System - Menu', () => {
    const menuName = `E2E菜单_${testRunId}`;
    const menuPerms = `e2e:menu:${testRunId}`;

    describe('POST /system/menu', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('post', `${apiPrefix}/system/menu`).send({}).expect(401);
      });

      it('缺少字段返回 400', async () => {
        await authed('post', `${apiPrefix}/system/menu`)
          .send({ menu_name: menuName })
          .expect(400);
      });

      it('创建成功返回 201', async () => {
        const res = await authed('post', `${apiPrefix}/system/menu`)
          .send({
            parent_id: 0,
            menu_name: menuName,
            order_num: 1,
            path: `e2e-${testRunId}`,
            component: 'system/user/index',
            menu_type: 'M',
            visible: '0',
            status: '0',
            perms: menuPerms,
            icon: '#',
            is_frame: 0,
            is_cache: 0,
          })
          .expect(201);
        expectOk(res.body as ApiResponseBody<SysMenu>);
        created.menuId = (res.body as ApiResponseBody<SysMenu>).data!.menu_id;
      });
    });

    describe('GET /system/menu/list', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed(
          'get',
          `${apiPrefix}/system/menu/list?menu_name=${menuName}`,
        ).expect(401);
      });

      it('访问成功', async () => {
        const res = await authed(
          'get',
          `${apiPrefix}/system/menu/list?menu_name=${menuName}`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });

    describe('GET /system/menu/:menuId', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed(
          'get',
          `${apiPrefix}/system/menu/${created.menuId}`,
        ).expect(401);
      });

      it('访问成功', async () => {
        const res = await authed(
          'get',
          `${apiPrefix}/system/menu/${created.menuId}`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<SysMenu>);
      });
    });

    describe('PUT /system/menu', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('put', `${apiPrefix}/system/menu`).send({}).expect(401);
      });

      it('缺少字段返回 400', async () => {
        await authed('put', `${apiPrefix}/system/menu`)
          .send({ menu_id: created.menuId })
          .expect(400);
      });

      it('更新成功', async () => {
        const res = await authed('put', `${apiPrefix}/system/menu`)
          .send({
            menu_id: created.menuId,
            parent_id: 0,
            menu_name: `${menuName}_2`,
            order_num: 2,
            path: `e2e-${testRunId}`,
            component: 'system/user/index',
            menu_type: 'M',
            visible: '0',
            status: '0',
            perms: menuPerms,
            icon: '#',
            is_frame: 0,
            is_cache: 0,
          })
          .expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });

    describe('DELETE /system/menu', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('delete', `${apiPrefix}/system/menu`)
          .send({ menu_id: created.menuId })
          .expect(401);
      });

      it('缺少 menu_id 返回 400', async () => {
        await authed('delete', `${apiPrefix}/system/menu`).send({}).expect(400);
      });

      it('删除成功', async () => {
        const res = await authed('delete', `${apiPrefix}/system/menu`)
          .send({ menu_id: created.menuId })
          .expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });
  });

  describe('System - Dict', () => {
    describe('Dict Type', () => {
      const dictType = `e2e_dict_${testRunId}`;

      describe('POST /system/dict/type', () => {
        it('未携带 token 返回 401', async () => {
          await unauthed('post', `${apiPrefix}/system/dict/type`)
            .send({})
            .expect(401);
        });

        it('缺少字段返回 400', async () => {
          await authed('post', `${apiPrefix}/system/dict/type`)
            .send({ dict_name: `E2E字典_${testRunId}` })
            .expect(400);
        });

        it('创建成功返回 201', async () => {
          const res = await authed('post', `${apiPrefix}/system/dict/type`)
            .send({
              dict_name: `E2E字典_${testRunId}`,
              dict_type: dictType,
              status: '0',
              remark: 'e2e',
            })
            .expect(201);
          expectOk(res.body as ApiResponseBody<SysDictType>);
          created.dictTypeId = (
            res.body as ApiResponseBody<SysDictType>
          ).data!.dict_id;
        });
      });

      describe('GET /system/dict/type/list', () => {
        it('未携带 token 返回 401', async () => {
          await unauthed(
            'get',
            `${apiPrefix}/system/dict/type/list?pageNum=1&pageSize=10&dict_type=${dictType}`,
          ).expect(401);
        });

        it('访问成功', async () => {
          const res = await authed(
            'get',
            `${apiPrefix}/system/dict/type/list?pageNum=1&pageSize=10&dict_type=${dictType}`,
          ).expect(200);
          expectOk(res.body as ApiResponseBody<any>);
        });
      });

      describe('GET /system/dict/type/:dictId', () => {
        it('未携带 token 返回 401', async () => {
          await unauthed(
            'get',
            `${apiPrefix}/system/dict/type/${created.dictTypeId}`,
          ).expect(401);
        });

        it('访问成功', async () => {
          const res = await authed(
            'get',
            `${apiPrefix}/system/dict/type/${created.dictTypeId}`,
          ).expect(200);
          expectOk(res.body as ApiResponseBody<SysDictType>);
        });
      });

      describe('PUT /system/dict/type', () => {
        it('未携带 token 返回 401', async () => {
          await unauthed('put', `${apiPrefix}/system/dict/type`)
            .send({})
            .expect(401);
        });

        it('缺少字段返回 400', async () => {
          await authed('put', `${apiPrefix}/system/dict/type`)
            .send({ dict_id: created.dictTypeId })
            .expect(400);
        });

        it('更新成功', async () => {
          const res = await authed('put', `${apiPrefix}/system/dict/type`)
            .send({
              dict_id: created.dictTypeId,
              dict_name: `E2E字典_${testRunId}_2`,
              dict_type: dictType,
              status: '0',
              remark: 'e2e2',
            })
            .expect(200);
          expectOk(res.body as ApiResponseBody<unknown>);
        });
      });

      describe('DELETE /system/dict/type', () => {
        it('未携带 token 返回 401', async () => {
          await unauthed('delete', `${apiPrefix}/system/dict/type`)
            .send({ dict_ids: [created.dictTypeId] })
            .expect(401);
        });

        it('缺少 dict_ids 返回 400', async () => {
          await authed('delete', `${apiPrefix}/system/dict/type`)
            .send({})
            .expect(400);
        });

        it('删除成功', async () => {
          const res = await authed('delete', `${apiPrefix}/system/dict/type`)
            .send({ dict_ids: [created.dictTypeId] })
            .expect(200);
          expectOk(res.body as ApiResponseBody<unknown>);
        });
      });
    });

    describe('Dict Data', () => {
      const dictType = `e2e_dict_data_${testRunId}`;
      let dictTypeId = 0;

      describe('POST /system/dict/type', () => {
        it('为字典数据创建类型', async () => {
          const res = await authed('post', `${apiPrefix}/system/dict/type`)
            .send({
              dict_name: `E2E字典数据_${testRunId}`,
              dict_type: dictType,
              status: '0',
              remark: 'e2e',
            })
            .expect(201);
          expectOk(res.body as ApiResponseBody<SysDictType>);
          dictTypeId = (res.body as ApiResponseBody<SysDictType>).data!.dict_id;
        });
      });

      describe('POST /system/dict/data', () => {
        it('未携带 token 返回 401', async () => {
          await unauthed('post', `${apiPrefix}/system/dict/data`)
            .send({})
            .expect(401);
        });

        it('缺少字段返回 400', async () => {
          await authed('post', `${apiPrefix}/system/dict/data`)
            .send({ dict_type: dictType })
            .expect(400);
        });

        it('创建成功返回 201', async () => {
          const res = await authed('post', `${apiPrefix}/system/dict/data`)
            .send({
              dict_type: dictType,
              dict_label: `E2E标签_${testRunId}`,
              dict_value: '1',
              dict_sort: 1,
              status: '0',
              remark: 'e2e',
            })
            .expect(201);
          expectOk(res.body as ApiResponseBody<SysDictData>);
          created.dictDataCode = (
            res.body as ApiResponseBody<SysDictData>
          ).data!.dict_code;
        });
      });

      describe('GET /system/dict/data/list', () => {
        it('未携带 token 返回 401', async () => {
          await unauthed(
            'get',
            `${apiPrefix}/system/dict/data/list?pageNum=1&pageSize=10&dict_type=${dictType}`,
          ).expect(401);
        });

        it('访问成功', async () => {
          const res = await authed(
            'get',
            `${apiPrefix}/system/dict/data/list?pageNum=1&pageSize=10&dict_type=${dictType}`,
          ).expect(200);
          expectOk(res.body as ApiResponseBody<any>);
        });
      });

      describe('GET /system/dict/data/:dictCode', () => {
        it('未携带 token 返回 401', async () => {
          await unauthed(
            'get',
            `${apiPrefix}/system/dict/data/${created.dictDataCode}`,
          ).expect(401);
        });

        it('访问成功', async () => {
          const res = await authed(
            'get',
            `${apiPrefix}/system/dict/data/${created.dictDataCode}`,
          ).expect(200);
          expectOk(res.body as ApiResponseBody<SysDictData>);
        });
      });

      describe('GET /system/dict/data/type/:dictType', () => {
        it('未携带 token 返回 401', async () => {
          await unauthed(
            'get',
            `${apiPrefix}/system/dict/data/type/${dictType}`,
          ).expect(401);
        });

        it('访问成功', async () => {
          const res = await authed(
            'get',
            `${apiPrefix}/system/dict/data/type/${dictType}`,
          ).expect(200);
          expectOk(res.body as ApiResponseBody<any>);
        });
      });

      describe('PUT /system/dict/data', () => {
        it('未携带 token 返回 401', async () => {
          await unauthed('put', `${apiPrefix}/system/dict/data`)
            .send({})
            .expect(401);
        });

        it('缺少字段返回 400', async () => {
          await authed('put', `${apiPrefix}/system/dict/data`)
            .send({ dict_code: created.dictDataCode })
            .expect(400);
        });

        it('更新成功', async () => {
          const res = await authed('put', `${apiPrefix}/system/dict/data`)
            .send({
              dict_code: created.dictDataCode,
              dict_type: dictType,
              dict_label: `E2E标签_${testRunId}_2`,
              dict_value: '2',
              dict_sort: 2,
              status: '0',
              remark: 'e2e2',
            })
            .expect(200);
          expectOk(res.body as ApiResponseBody<unknown>);
        });
      });

      describe('DELETE /system/dict/data', () => {
        it('未携带 token 返回 401', async () => {
          await unauthed('delete', `${apiPrefix}/system/dict/data`)
            .send({ dict_codes: [created.dictDataCode] })
            .expect(401);
        });

        it('缺少 dict_codes 返回 400', async () => {
          await authed('delete', `${apiPrefix}/system/dict/data`)
            .send({})
            .expect(400);
        });

        it('删除成功', async () => {
          const res = await authed('delete', `${apiPrefix}/system/dict/data`)
            .send({ dict_codes: [created.dictDataCode] })
            .expect(200);
          expectOk(res.body as ApiResponseBody<unknown>);
        });
      });

      describe('DELETE /system/dict/type', () => {
        it('清理字典类型', async () => {
          await authed('delete', `${apiPrefix}/system/dict/type`)
            .send({ dict_ids: [dictTypeId] })
            .expect(200);
        });
      });
    });
  });

  describe('System - Notice', () => {
    const noticeTitle = `E2E公告_${testRunId}`;

    describe('POST /system/notice', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('post', `${apiPrefix}/system/notice`)
          .send({})
          .expect(401);
      });

      it('缺少字段返回 400', async () => {
        await authed('post', `${apiPrefix}/system/notice`)
          .send({ notice_title: noticeTitle })
          .expect(400);
      });

      it('创建成功返回 201', async () => {
        const res = await authed('post', `${apiPrefix}/system/notice`)
          .send({
            notice_title: noticeTitle,
            notice_type: '1',
            notice_content: 'e2e',
            status: '0',
          })
          .expect(201);
        expectOk(res.body as ApiResponseBody<SysNotice>);
        created.noticeId = (
          res.body as ApiResponseBody<SysNotice>
        ).data!.notice_id;
      });
    });

    describe('GET /system/notice/list', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed(
          'get',
          `${apiPrefix}/system/notice/list?pageNum=1&pageSize=10&notice_title=${noticeTitle}`,
        ).expect(401);
      });

      it('访问成功', async () => {
        const res = await authed(
          'get',
          `${apiPrefix}/system/notice/list?pageNum=1&pageSize=10&notice_title=${noticeTitle}`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<any>);
      });
    });

    describe('GET /system/notice/:noticeId', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed(
          'get',
          `${apiPrefix}/system/notice/${created.noticeId}`,
        ).expect(401);
      });

      it('访问成功', async () => {
        const res = await authed(
          'get',
          `${apiPrefix}/system/notice/${created.noticeId}`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<SysNotice>);
      });
    });

    describe('PUT /system/notice', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('put', `${apiPrefix}/system/notice`)
          .send({})
          .expect(401);
      });

      it('缺少字段返回 400', async () => {
        await authed('put', `${apiPrefix}/system/notice`)
          .send({ notice_id: created.noticeId })
          .expect(400);
      });

      it('更新成功', async () => {
        const res = await authed('put', `${apiPrefix}/system/notice`)
          .send({
            notice_id: created.noticeId,
            notice_title: `${noticeTitle}_2`,
            notice_type: '1',
            notice_content: 'e2e2',
            status: '0',
          })
          .expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });

    describe('DELETE /system/notice', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('delete', `${apiPrefix}/system/notice`)
          .send({ notice_ids: [created.noticeId] })
          .expect(401);
      });

      it('缺少 notice_ids 返回 400', async () => {
        await authed('delete', `${apiPrefix}/system/notice`)
          .send({})
          .expect(400);
      });

      it('删除成功', async () => {
        const res = await authed('delete', `${apiPrefix}/system/notice`)
          .send({ notice_ids: [created.noticeId] })
          .expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });
  });

  describe('System - Role', () => {
    const roleName = `E2E角色_${testRunId}`;
    const roleKey = `E2E_ROLE_${testRunId}`;

    describe('POST /system/role', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('post', `${apiPrefix}/system/role`).send({}).expect(401);
      });

      it('缺少字段返回 400', async () => {
        await authed('post', `${apiPrefix}/system/role`)
          .send({ role_name: roleName })
          .expect(400);
      });

      it('创建成功返回 201', async () => {
        const res = await authed('post', `${apiPrefix}/system/role`)
          .send({
            role_name: roleName,
            role_key: roleKey,
            role_sort: 2,
            status: '0',
            remark: 'e2e',
          })
          .expect(201);
        expectOk(res.body as ApiResponseBody<SysRole>);
        created.roleCrudId = (
          res.body as ApiResponseBody<SysRole>
        ).data!.role_id;
      });
    });

    describe('GET /system/role/list', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed(
          'get',
          `${apiPrefix}/system/role/list?pageNum=1&pageSize=10&role_name=${roleName}`,
        ).expect(401);
      });

      it('访问成功', async () => {
        const res = await authed(
          'get',
          `${apiPrefix}/system/role/list?pageNum=1&pageSize=10&role_name=${roleName}`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<any>);
      });
    });

    describe('GET /system/role/:roleId', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed(
          'get',
          `${apiPrefix}/system/role/${created.roleCrudId}`,
        ).expect(401);
      });

      it('访问成功', async () => {
        const res = await authed(
          'get',
          `${apiPrefix}/system/role/${created.roleCrudId}`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<SysRole>);
      });
    });

    describe('PUT /system/role', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('put', `${apiPrefix}/system/role`).send({}).expect(401);
      });

      it('缺少字段返回 400', async () => {
        await authed('put', `${apiPrefix}/system/role`)
          .send({ role_id: created.roleCrudId })
          .expect(400);
      });

      it('更新成功', async () => {
        const res = await authed('put', `${apiPrefix}/system/role`)
          .send({
            role_id: created.roleCrudId,
            role_name: `${roleName}_2`,
            role_key: roleKey,
            role_sort: 3,
            status: '0',
            remark: 'e2e2',
          })
          .expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });

    describe('PUT /system/role/changeStatus', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('put', `${apiPrefix}/system/role/changeStatus`)
          .send({})
          .expect(401);
      });

      it('缺少字段返回 400', async () => {
        await authed('put', `${apiPrefix}/system/role/changeStatus`)
          .send({ role_id: created.roleCrudId })
          .expect(400);
      });

      it('修改状态成功', async () => {
        const res = await authed('put', `${apiPrefix}/system/role/changeStatus`)
          .send({ role_id: created.roleCrudId, status: '0' })
          .expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });

    describe('DELETE /system/role', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('delete', `${apiPrefix}/system/role`)
          .send({ role_ids: [created.roleCrudId] })
          .expect(401);
      });

      it('缺少 role_ids 返回 400', async () => {
        await authed('delete', `${apiPrefix}/system/role`).send({}).expect(400);
      });

      it('删除成功', async () => {
        const res = await authed('delete', `${apiPrefix}/system/role`)
          .send({ role_ids: [created.roleCrudId] })
          .expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });
  });

  describe('System - User', () => {
    const userName = `e2e_user_${testRunId}`;

    describe('GET /system/user/list', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('get', `${apiPrefix}/system/user/list`).expect(401);
      });

      it('无效 token 返回 401', async () => {
        await authedWithToken(
          'get',
          `${apiPrefix}/system/user/list`,
          invalidToken,
        ).expect(401);
      });

      it('携带 token 访问成功', async () => {
        const res = await authed(
          'get',
          `${apiPrefix}/system/user/list?pageNum=1&pageSize=10`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<any>);
      });
    });

    describe('POST /system/user', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('post', `${apiPrefix}/system/user`).send({}).expect(401);
      });

      it('缺少字段返回 400', async () => {
        await authed('post', `${apiPrefix}/system/user`)
          .send({ user_name: userName })
          .expect(400);
      });

      it('创建成功返回 201', async () => {
        const res = await authed('post', `${apiPrefix}/system/user`)
          .send({
            user_name: userName,
            nick_name: `E2E用户_${testRunId}`,
            password: '123456',
            dept_id: created.deptId,
            phonenumber: '15888888880',
            email: `e2e_user_${testRunId}@example.com`,
            sex: '1',
            status: '0',
            remark: 'e2e',
          })
          .expect(201);
        expectOk(res.body as ApiResponseBody<SysUser>);
        created.userCrudId = (
          res.body as ApiResponseBody<SysUser>
        ).data!.user_id;
      });
    });

    describe('GET /system/user/:userId', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed(
          'get',
          `${apiPrefix}/system/user/${created.userCrudId}`,
        ).expect(401);
      });

      it('访问成功', async () => {
        const res = await authed(
          'get',
          `${apiPrefix}/system/user/${created.userCrudId}`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<SysUser>);
      });
    });

    describe('PUT /system/user', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('put', `${apiPrefix}/system/user`).send({}).expect(401);
      });

      it('缺少字段返回 400', async () => {
        await authed('put', `${apiPrefix}/system/user`)
          .send({ user_id: created.userCrudId })
          .expect(400);
      });

      it('更新成功', async () => {
        const res = await authed('put', `${apiPrefix}/system/user`)
          .send({
            user_id: created.userCrudId,
            user_name: userName,
            nick_name: `E2E用户_${testRunId}_2`,
            dept_id: created.deptId,
            phonenumber: '15888888881',
            email: `e2e_user_${testRunId}@example.com`,
            sex: '1',
            status: '0',
            remark: 'e2e2',
          })
          .expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });

    describe('PUT /system/user/resetPwd', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('put', `${apiPrefix}/system/user/resetPwd`)
          .send({})
          .expect(401);
      });

      it('缺少字段返回 400', async () => {
        await authed('put', `${apiPrefix}/system/user/resetPwd`)
          .send({ user_id: created.userCrudId })
          .expect(400);
      });

      it('重置密码成功', async () => {
        const res = await authed('put', `${apiPrefix}/system/user/resetPwd`)
          .send({ user_id: created.userCrudId, password: '123456' })
          .expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });

    describe('PUT /system/user/changeStatus', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('put', `${apiPrefix}/system/user/changeStatus`)
          .send({})
          .expect(401);
      });

      it('缺少字段返回 400', async () => {
        await authed('put', `${apiPrefix}/system/user/changeStatus`)
          .send({ user_id: created.userCrudId })
          .expect(400);
      });

      it('修改状态成功', async () => {
        const res = await authed('put', `${apiPrefix}/system/user/changeStatus`)
          .send({ user_id: created.userCrudId, status: '0' })
          .expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });

    describe('DELETE /system/user', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('delete', `${apiPrefix}/system/user`)
          .send({ user_ids: [created.userCrudId] })
          .expect(401);
      });

      it('缺少 user_ids 返回 400', async () => {
        await authed('delete', `${apiPrefix}/system/user`).send({}).expect(400);
      });

      it('删除成功', async () => {
        const res = await authed('delete', `${apiPrefix}/system/user`)
          .send({ user_ids: [created.userCrudId] })
          .expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });
  });

  describe('Monitor - Online', () => {
    describe('GET /monitor/online/list', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed(
          'get',
          `${apiPrefix}/monitor/online/list?pageNum=1&pageSize=10`,
        ).expect(401);
      });

      it('访问成功', async () => {
        const res = await authed(
          'get',
          `${apiPrefix}/monitor/online/list?pageNum=1&pageSize=10`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<any>);
      });
    });

    describe('DELETE /monitor/online', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('delete', `${apiPrefix}/monitor/online`)
          .send({ token_id: tokenId })
          .expect(401);
      });

      it('缺少 token_id 返回 400', async () => {
        await authed('delete', `${apiPrefix}/monitor/online`)
          .send({})
          .expect(400);
      });

      it('强退成功', async () => {
        const res = await authed('delete', `${apiPrefix}/monitor/online`)
          .send({ token_id: tokenId })
          .expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });
  });

  describe('Monitor - OperLog', () => {
    beforeAll(async () => {
      const oper = await SysOperLog.create({
        title: `E2E_${testRunId}`,
        oper_name: 'admin',
        status: 0,
        oper_time: new Date(),
      } as any);
      created.operId = oper.oper_id;
    });

    describe('GET /monitor/operlog/list', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed(
          'get',
          `${apiPrefix}/monitor/operlog/list?pageNum=1&pageSize=10`,
        ).expect(401);
      });

      it('访问成功', async () => {
        const res = await authed(
          'get',
          `${apiPrefix}/monitor/operlog/list?pageNum=1&pageSize=10&title=E2E_${testRunId}`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<any>);
      });
    });

    describe('DELETE /monitor/operlog', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('delete', `${apiPrefix}/monitor/operlog`)
          .send({ oper_ids: [created.operId] })
          .expect(401);
      });

      it('缺少 oper_ids 返回 400', async () => {
        await authed('delete', `${apiPrefix}/monitor/operlog`)
          .send({})
          .expect(400);
      });

      it('删除成功', async () => {
        const res = await authed('delete', `${apiPrefix}/monitor/operlog`)
          .send({ oper_ids: [created.operId] })
          .expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });

    describe('DELETE /monitor/operlog/clean', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('delete', `${apiPrefix}/monitor/operlog/clean`).expect(
          401,
        );
      });

      it('清空成功', async () => {
        const res = await authed(
          'delete',
          `${apiPrefix}/monitor/operlog/clean`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });
  });

  describe('Monitor - Logininfor', () => {
    beforeAll(async () => {
      const info = await SysLogininfor.create({
        user_name: `e2e_admin_${testRunId}`,
        ipaddr: '127.0.0.1',
        status: '0',
        msg: 'e2e',
        login_time: new Date(),
      } as any);
      created.loginInfoId = info.info_id;
    });

    describe('GET /monitor/logininfor/list', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed(
          'get',
          `${apiPrefix}/monitor/logininfor/list?pageNum=1&pageSize=10`,
        ).expect(401);
      });

      it('访问成功', async () => {
        const res = await authed(
          'get',
          `${apiPrefix}/monitor/logininfor/list?pageNum=1&pageSize=10&user_name=e2e_admin_${testRunId}`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<any>);
      });
    });

    describe('DELETE /monitor/logininfor', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed('delete', `${apiPrefix}/monitor/logininfor`)
          .send({ info_ids: [created.loginInfoId] })
          .expect(401);
      });

      it('缺少 info_ids 返回 400', async () => {
        await authed('delete', `${apiPrefix}/monitor/logininfor`)
          .send({})
          .expect(400);
      });

      it('删除成功', async () => {
        const res = await authed('delete', `${apiPrefix}/monitor/logininfor`)
          .send({ info_ids: [created.loginInfoId] })
          .expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });

    describe('DELETE /monitor/logininfor/clean', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed(
          'delete',
          `${apiPrefix}/monitor/logininfor/clean`,
        ).expect(401);
      });

      it('清空成功', async () => {
        const res = await authed(
          'delete',
          `${apiPrefix}/monitor/logininfor/clean`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });

    describe('GET /monitor/logininfor/unlock/:user_name', () => {
      it('未携带 token 返回 401', async () => {
        await unauthed(
          'get',
          `${apiPrefix}/monitor/logininfor/unlock/e2e_admin_${testRunId}`,
        ).expect(401);
      });

      it('解锁成功', async () => {
        const res = await authed(
          'get',
          `${apiPrefix}/monitor/logininfor/unlock/e2e_admin_${testRunId}`,
        ).expect(200);
        expectOk(res.body as ApiResponseBody<unknown>);
      });
    });
  });
});

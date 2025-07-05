import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from '../redis.service';
import { RedisModule } from '../redis.module';
import { Test as TestModel } from '@/databases/mysql-database/model/test.model';
import type { TestInter } from '@/databases/mysql-database/interfaces/test.interface';
import { Op } from 'sequelize';
import { MysqlDatabaseModule } from '@/databases';
import { Sequelize } from 'sequelize-typescript';
describe('RedisService (Integration)', () => {
  let redisService: RedisService;
  let module: TestingModule;
  let sequelize: Sequelize;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [MysqlDatabaseModule, RedisModule],
    }).compile();
    redisService = module.get<RedisService>(RedisService);
    sequelize = module.get<Sequelize>(Sequelize);
  });
  it('should be defined', () => {
    expect(redisService).toBeDefined();
    expect(sequelize).toBeDefined();
  });
  afterAll(async () => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
    redisService.redis.disconnect();
    await sequelize.close();
    await module.close();
  });
  describe('setCache and getCache', () => {
    it('should set data to Redis', async () => {
      const data = { id: 1, name: 'Bob' };
      const key = 'user:1';
      const result = await redisService.setCache(key, data);
      expect(result).toBe(true);
      await redisService.redis.del(key);
    });
    it('should set data to Redis and expire in seconds and getCache', async () => {
      const data = { id: 1, name: 'Bob' };
      const key = 'user-2:1';
      const result = await redisService.setCache(key, data, 10);
      expect(result).toBe(true);
      const cached = await redisService.getCatche<typeof data>(key);
      expect(cached).toEqual(data);
      await redisService.redis.del(key);
    });
    it('getCatche timeout', async () => {
      const data = { id: 1, name: 'Bob' };
      const key = 'user-expire:1';
      const result = await redisService.setCache(key, data, 1);
      expect(result).toBe(true);
      const wait = () =>
        new Promise((r) => {
          const timer = setTimeout(() => {
            clearTimeout(timer);
            r(void 0);
          }, 5000).unref();
        });
      await wait();
      const r = await redisService.getCatche<typeof data>(key);
      expect(r).toBeUndefined();
    }, 7000);
  });

  describe('selectOne', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let testRecord: TestModel;
    const testId = 'e9c7a82b-1d4e-4f6a-8c3b-5d6e7f8a9b0c';
    const redisKey = `test:${testId}`;
    const data = {
      id: testId,
      message: 'initial_test_message',
    };
    const clear = async () => {
      await TestModel.destroy({ where: { id: testId } });
      await redisService.redis.del(redisKey);
      await redisService.redis.del('test:complex_query');
    };
    beforeAll(async () => {
      testRecord = await TestModel.create(data);
    });

    afterAll(async () => {
      await clear();
    });

    it('should fetch from DB and cache with field filtering', async () => {
      const key = redisKey;

      const result = await redisService.selectOne<TestInter, TestModel>(
        TestModel,
        {
          key,
          where: { id: testId },
          attrs: ['id'],
        },
      );
      expect(result!.id).toBe(testId);

      const cached = await redisService.getCatche<TestInter>(key);
      expect(cached).toEqual({
        id: testId,
      });
    });

    it('should return cached data without DB query', async () => {
      const key = redisKey;

      const cachedResult = await redisService.selectOne<TestInter, TestModel>(
        TestModel,
        {
          key,
        },
      );

      expect(cachedResult).toEqual({
        id: testId,
      });

      const spy = jest.spyOn(TestModel, 'findOne');
      await redisService.selectOne<TestInter, TestModel>(TestModel, { key });
      expect(spy).not.toHaveBeenCalled();
    });
    it('should not handle undefined', async () => {
      const key = 'test:one:empty';
      const result = await redisService.selectOne<TestInter, TestModel>(
        TestModel,
        {
          key,
          where: {
            id: 'xx',
          },
        },
      );
      expect(result).toBeNull();

      const catche = await redisService.redis.get(key);
      expect(catche).toBeNull();
    });
    it('Caching should be determined based on the conditions', async () => {
      const key = 'test:one:where-empty';
      const result = await redisService.selectOne<TestInter, TestModel>(
        TestModel,
        {
          key,
          where: {
            id: 'xx',
          },
        },
        (r) => Boolean(r),
      );
      expect(result).toBeNull();

      const catche = await redisService.redis.get(key);
      expect(catche).toBeNull();
    });
    it('should handle complex where conditions', async () => {
      const key = 'test:complex_query';
      const result = await redisService.selectOne<TestInter, TestModel>(
        TestModel,
        {
          key,
          where: {
            [Op.or]: {
              message: data.message,
              id: 'lkajgl',
            },
          },
          expiretime: 5000,
        },
      );

      expect(result!.id).toBe(testId);

      const ttl = await redisService.redis.ttl(key);
      expect(ttl).toBeGreaterThan(0);
    });
  });

  describe('selectAll', () => {
    const testRecords = [
      { id: 'b2c3d4e5-f6g7-4h8i-9j0k-al1b2c3d4e5f', message: 'msg_1' },
      { id: 'c3d4e5f6-g7h8-4i9j-0k1l-bm2c3d4e5f6g', message: 'msg_2' },
      { id: 'd4e5f6g7-h8i9-4j0k-1l1m-cn2d3e4f5g6h', message: 'msg_3' },
    ];

    beforeAll(async () => {
      await TestModel.bulkCreate(testRecords);
    });

    afterAll(async () => {
      await TestModel.destroy({
        where: {
          id: testRecords.map((r) => r.id),
        },
      });
      await redisService.redis.del('tests:pagination');
      await redisService.redis.del('tests:empty_set');
      await redisService.redis.del('tests:temp_cache');
    });

    it('should cache paginated results', async () => {
      const key = 'tests:pagination';

      const firstPage = await redisService.selectAll<TestInter, TestModel>(
        TestModel,
        {
          key,
          limit: 2,
          offset: 0,
          order: [['message', 'ASC']],
          expiretime: 10,
        },
      );

      expect(firstPage).toHaveLength(2);
      expect(firstPage[0].message).toBe('msg_1');

      const cached = await redisService.getCatche<Test[]>(key);
      expect(cached).toHaveLength(2);
    });

    it('should handle empty result sets', async () => {
      const key = 'tests:empty_set';

      const results = await redisService.selectAll<TestInter[], TestModel>(
        TestModel,
        {
          key,
          where: {
            message: 'non_existent_message',
          },
        },
      );

      expect(results).toHaveLength(0);

      // Decide whether to cache empty results based on business requirements
      const cached = await redisService.getCatche<TestInter[]>(key);
      expect(cached).toBeUndefined();
    });

    it('should refresh cache after expiration', async () => {
      const key = 'tests:temp_cache';

      // Initial query
      await redisService.selectAll<TestInter[], TestModel>(TestModel, {
        key,
        expiretime: 2,
      });

      // Wait for cache to expire
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Verify cache invalidation
      const expired = await redisService.getCatche(key);
      expect(expired).toBeUndefined();

      // The second query should be re-cached
      const freshData = await redisService.selectAll<TestInter[], TestModel>(
        TestModel,
        {
          key,
        },
      );
      expect(freshData.length).toBeGreaterThan(0);
    });

    it('should not handle empty array', async () => {
      const key = 'test:one:empty-all';
      const result = await redisService.selectAll<TestInter, TestModel>(
        TestModel,
        {
          key,
          where: {
            id: 'xx',
          },
        },
      );
      expect(result.length).toBe(0);
      const catche = await redisService.redis.get(key);
      expect(catche).toBeNull();
    });
    it('Caching should be determined based on the conditions', async () => {
      const key = 'test:one:where-empty-all';
      const result = await redisService.selectAll<TestInter, TestModel>(
        TestModel,
        {
          key,
          where: {
            id: 'xx',
          },
        },
        (r) => r.length > 0,
      );
      expect(result.length).toBe(0);

      const catche = await redisService.redis.get(key);
      expect(catche).toBeNull();
    });
  });
});

import { Model } from 'sequelize-typescript';
import type { UseFindParamsOpt } from './types';
import { RedisService } from './redis.service';

describe('RedisService', () => {
  let redis: {
    get: jest.Mock;
    set: jest.Mock;
  };
  let service: RedisService;

  beforeEach(() => {
    redis = {
      get: jest.fn(),
      set: jest.fn(),
    };
    service = new RedisService(redis as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getCatche', () => {
    it('should return undefined when key does not exist', async () => {
      redis.get.mockResolvedValue(null);
      await expect(service.getCatche('k')).resolves.toBeUndefined();
    });

    it('should parse json by default', async () => {
      redis.get.mockResolvedValue(JSON.stringify({ a: 1 }));
      await expect(service.getCatche<{ a: number }>('k')).resolves.toEqual({
        a: 1,
      });
    });

    it('should return raw string when isparse is false', async () => {
      redis.get.mockResolvedValue('raw');
      await expect(service.getCatche<string>('k', false)).resolves.toBe('raw');
    });
  });

  describe('setCache', () => {
    it('should set json without expiretime', async () => {
      await expect(service.setCache('k', { a: 1 })).resolves.toBe(true);
      expect(redis.set).toHaveBeenCalledWith('k', JSON.stringify({ a: 1 }));
    });

    it('should set json with expiretime', async () => {
      await expect(service.setCache('k', { a: 1 }, 10)).resolves.toBe(true);
      expect(redis.set).toHaveBeenCalledWith(
        'k',
        JSON.stringify({ a: 1 }),
        'EX',
        10,
      );
    });
  });

  describe('selectOne', () => {
    it('should return cached result when cache hit', async () => {
      jest.spyOn(service, 'getCatche').mockResolvedValue({ id: 1 } as any);

      const model = {
        findOne: jest.fn(),
      };
      const opt: UseFindParamsOpt = { key: 'k' };

      await expect(
        service.selectOne<{ id: number }, any>(
          model as any as typeof Model,
          opt,
        ),
      ).resolves.toEqual({ id: 1 });
      expect(model.findOne).not.toHaveBeenCalled();
    });

    it('should query model and cache by default when found', async () => {
      jest.spyOn(service, 'getCatche').mockResolvedValue(undefined);
      const setCacheSpy = jest
        .spyOn(service, 'setCache')
        .mockResolvedValue(true);

      const model = {
        findOne: jest.fn(async () => ({ id: 1 })),
      };
      const opt: UseFindParamsOpt = {
        key: 'k',
        attrs: ['id'],
        where: { id: 1 },
        expiretime: 123,
      };

      await expect(
        service.selectOne<{ id: number }, any>(
          model as any as typeof Model,
          opt,
        ),
      ).resolves.toEqual({ id: 1 });

      expect(model.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          attributes: ['id'],
        }),
      );
      expect(setCacheSpy).toHaveBeenCalledWith('k', { id: 1 }, 123);
    });

    it('should not cache when value is null', async () => {
      jest.spyOn(service, 'getCatche').mockResolvedValue(undefined);
      const setCacheSpy = jest
        .spyOn(service, 'setCache')
        .mockResolvedValue(true);

      const model = {
        findOne: jest.fn(async () => null),
      };
      const opt: UseFindParamsOpt = { key: 'k' };

      await expect(
        service.selectOne<any, any>(model as any as typeof Model, opt),
      ).resolves.toBeNull();
      expect(setCacheSpy).not.toHaveBeenCalled();
    });

    it('should respect isCacheCb result', async () => {
      jest.spyOn(service, 'getCatche').mockResolvedValue(undefined);
      const setCacheSpy = jest
        .spyOn(service, 'setCache')
        .mockResolvedValue(true);

      const model = {
        findOne: jest.fn(async () => ({ id: 1 })),
      };
      const opt: UseFindParamsOpt = { key: 'k' };

      await expect(
        service.selectOne<{ id: number }, any>(
          model as any as typeof Model,
          opt,
          () => false,
        ),
      ).resolves.toEqual({ id: 1 });
      expect(setCacheSpy).not.toHaveBeenCalled();
    });
  });

  describe('selectAll', () => {
    it('should return cached result when cache hit', async () => {
      jest.spyOn(service, 'getCatche').mockResolvedValue([{ id: 1 }] as any);
      const model = {
        findAll: jest.fn(),
      };
      const opt: UseFindParamsOpt = { key: 'k' };

      await expect(
        service.selectAll<{ id: number }, any>(
          model as any as typeof Model,
          opt,
        ),
      ).resolves.toEqual([{ id: 1 }]);
      expect(model.findAll).not.toHaveBeenCalled();
    });

    it('should query model and cache by default when non-empty', async () => {
      jest.spyOn(service, 'getCatche').mockResolvedValue(undefined);
      const setCacheSpy = jest
        .spyOn(service, 'setCache')
        .mockResolvedValue(true);

      const model = {
        findAll: jest.fn(async () => [{ id: 1 }]),
      };
      const opt: UseFindParamsOpt = { key: 'k', expiretime: 1 };

      await expect(
        service.selectAll<{ id: number }, any>(
          model as any as typeof Model,
          opt,
        ),
      ).resolves.toEqual([{ id: 1 }]);
      expect(setCacheSpy).toHaveBeenCalledWith('k', [{ id: 1 }], 1);
    });

    it('should not cache when empty by default', async () => {
      jest.spyOn(service, 'getCatche').mockResolvedValue(undefined);
      const setCacheSpy = jest
        .spyOn(service, 'setCache')
        .mockResolvedValue(true);

      const model = {
        findAll: jest.fn(async () => []),
      };
      const opt: UseFindParamsOpt = { key: 'k' };

      await expect(
        service.selectAll<any, any>(model as any as typeof Model, opt),
      ).resolves.toEqual([]);
      expect(setCacheSpy).not.toHaveBeenCalled();
    });

    it('should respect isCacheCb for selectAll', async () => {
      jest.spyOn(service, 'getCatche').mockResolvedValue(undefined);
      const setCacheSpy = jest
        .spyOn(service, 'setCache')
        .mockResolvedValue(true);

      const model = {
        findAll: jest.fn(async () => [{ id: 1 }]),
      };
      const opt: UseFindParamsOpt = { key: 'k' };

      await expect(
        service.selectAll<{ id: number }, any>(
          model as any as typeof Model,
          opt,
          () => false,
        ),
      ).resolves.toEqual([{ id: 1 }]);
      expect(setCacheSpy).not.toHaveBeenCalled();
    });
  });
});

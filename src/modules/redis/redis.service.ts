import { Injectable, Logger } from '@nestjs/common';
import { FindOptions, ModelStatic } from 'sequelize';
import { Model } from 'sequelize-typescript';
import type {
  UseFindParamsOpt,
  SelectAllResponse,
  SelectOneResponse,
} from './types/index';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

const useFindParams = (opt: UseFindParamsOpt) => {
  const blackList = ['attrs'];
  if (Array.isArray(opt.attrs)) {
    opt.attributes = [...opt.attrs];
  }
  const obj = Object.keys(opt)
    .filter((key) => !blackList.includes(key))
    .reduce((acc, key) => {
      acc[key] = opt[key];
      return acc;
    }, {});
  return {
    ...obj,
  } as FindOptions;
};

const parse = <T = any>(data: string, is?: boolean): T => {
  if (is) return JSON.parse(data) as T;
  return data as T;
};

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  constructor(@InjectRedis() public readonly redis: Redis) {}
  async selectOne<R, M extends Model>(
    m: typeof Model,
    opt: UseFindParamsOpt,
    /**
     * 根据值确定是否缓存结果。
     * 默认情况下，如果检索到的数据未定义，则不会缓存。
     */
    isCacheCb?: (r: SelectOneResponse<R>) => boolean,
  ): Promise<SelectOneResponse<R>> {
    const catcheRes = await this.getCatche<SelectOneResponse<R>>(opt.key);
    if (typeof catcheRes !== 'undefined') return catcheRes;
    const unifyOpt = useFindParams(opt);
    const data = (await (m as unknown as ModelStatic<M>).findOne(
      unifyOpt,
    )) as unknown as SelectOneResponse<R>;
    let flag: boolean = Boolean(data);
    if (isCacheCb) {
      flag = isCacheCb(data);
    }
    if (flag) {
      await this.setCache(opt.key, data, opt.expiretime);
    }
    return data as unknown as SelectOneResponse<R>;
  }
  async selectAll<R, M extends Model>(
    m: typeof Model,
    opt: UseFindParamsOpt,
    /**
     * 根据值确定是否缓存。
     * 默认情况下，当数组元素大于 0 时进行缓存。
     */
    isCacheCb?: (r: SelectAllResponse<R>) => boolean,
  ): Promise<SelectAllResponse<R>> {
    const catcheRes = await this.getCatche<R>(opt.key);
    if (typeof catcheRes !== 'undefined')
      return catcheRes as SelectAllResponse<R>;
    const unifyOpt = useFindParams(opt);
    const data = (await (m as unknown as ModelStatic<M>).findAll(
      unifyOpt,
    )) as unknown as SelectAllResponse<R>;
    let flag: boolean = false;
    if (isCacheCb) {
      flag = isCacheCb(data);
    } else if (data.length > 0) {
      flag = true;
    }
    if (flag) {
      await this.setCache(opt.key, data, opt.expiretime);
    }
    return data;
  }
  async getCatche<R = unknown>(key: string, isparse: boolean = true) {
    const catcheRes = await this.redis.get(key);
    if (catcheRes) return parse<R>(catcheRes, isparse);
    return void 0;
  }
  async setCache<T>(key: string, data: T, expiretime?: number) {
    if (expiretime) {
      await this.redis.set(key, JSON.stringify(data), 'EX', expiretime);
    } else {
      await this.redis.set(key, JSON.stringify(data));
    }
    return true;
  }
}

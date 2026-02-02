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

/**
 * Redis 缓存服务
 *
 * 基于 `ioredis` 提供统一缓存访问能力，并封装常用的查询与缓存写入逻辑（用于降低业务层与缓存层的耦合）。
 *
 * @export
 * @class RedisService
 * @typedef {RedisService}
 */
@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  /**
   * 构造函数
   *
   * @param {Redis} redis Redis 客户端实例
   */
  constructor(@InjectRedis() public readonly redis: Redis) {}

  /**
   * 查询单条数据并按 key 缓存结果
   *
   * @template R
   * @template {Model} M
   * @param {typeof Model} m Sequelize Model 类
   * @param {UseFindParamsOpt} opt 查询与缓存参数
   * @param {(r: SelectOneResponse<R>) => boolean} [isCacheCb] 自定义是否缓存回调
   * @returns {Promise<SelectOneResponse<R>>} 查询结果
   */
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

  /**
   * 查询列表数据并按 key 缓存结果
   *
   * @template R
   * @template {Model} M
   * @param {typeof Model} m Sequelize Model 类
   * @param {UseFindParamsOpt} opt 查询与缓存参数
   * @param {(r: SelectAllResponse<R>) => boolean} [isCacheCb] 自定义是否缓存回调
   * @returns {Promise<SelectAllResponse<R>>} 查询结果列表
   */
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

  /**
   * 从 Redis 获取缓存
   *
   * @template R
   * @param {string} key 缓存 key
   * @param {boolean} [isparse=true] 是否对 value 做 JSON.parse
   * @returns {(Promise<R | undefined>)} 命中返回数据，未命中返回 undefined
   */
  async getCatche<R = unknown>(key: string, isparse: boolean = true) {
    const catcheRes = await this.redis.get(key);
    if (catcheRes) return parse<R>(catcheRes, isparse);
    return void 0;
  }

  /**
   * 写入缓存
   *
   * @template T
   * @param {string} key 缓存 key
   * @param {T} data 要缓存的数据
   * @param {number} [expiretime] 过期时间（秒）
   * @returns {Promise<boolean>} 写入成功返回 true
   */
  async setCache<T>(key: string, data: T, expiretime?: number) {
    if (expiretime) {
      await this.redis.set(key, JSON.stringify(data), 'EX', expiretime);
    } else {
      await this.redis.set(key, JSON.stringify(data));
    }
    return true;
  }
}

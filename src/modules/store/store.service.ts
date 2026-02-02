import { Injectable } from '@nestjs/common';

/**
 * 全局状态存储服务
 *
 * 用于在进程内保存简单的共享状态（不具备持久化与多实例一致性能力）。
 *
 * @export
 * @class StoreService
 * @typedef {StoreService}
 */
@Injectable()
export class StoreService {
  state = {};
}

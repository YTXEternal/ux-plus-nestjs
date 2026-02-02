import { Module, Global } from '@nestjs/common';
import { StoreService } from './store.service';

@Global()
/**
 * 全局状态模块
 *
 * 提供一个应用级别的简单状态存储（`StoreService`），并以全局模块方式导出供其他模块注入使用。
 *
 * @export
 * @class StoreModule
 * @typedef {StoreModule}
 */
@Module({
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}

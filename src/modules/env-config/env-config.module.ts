import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { getEnvPaths } from '@/tools';

@Global()
/**
 * 环境配置模块
 *
 * 基于 `@nestjs/config` 加载 env 文件并启用全局配置缓存，作为应用的基础设施模块供其他模块依赖。
 *
 * @export
 * @class EnvConfigModule
 * @typedef {EnvConfigModule}
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvPaths(),
      isGlobal: true,
      cache: true,
    }),
  ],
})
export class EnvConfigModule {}

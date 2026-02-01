import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { getEnvPaths } from '@/tools';

@Global()
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

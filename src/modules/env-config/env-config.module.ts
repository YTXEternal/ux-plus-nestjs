import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: (() => {
        const environment = process.env.NODE_ENV;
        const m: string[] = [];
        switch (environment) {
          case 'production':
            m.push('.env.production');
            break;
          case 'test':
            m.push('.env.test');
            break;
          case 'development':
          default:
            m.push('.env.development');
            break;
        }
        return [...m, '.env'];
      })(),
      isGlobal: true,
      cache: true,
    }),
  ],
})
export class EnvConfigModule {}

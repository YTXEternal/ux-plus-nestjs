import { Module } from '@nestjs/common';
import { JwtModule, type JwtModuleOptions } from '@nestjs/jwt';
import { UxJwtService } from './ux-jwt.service';
import { ConfigService } from '@nestjs/config';
import { EnvConfigModule } from '@/modules/env-config/env-config.module';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [EnvConfigModule],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const privateKeyPath = resolve(
          __dirname,
          `../../../${configService.get<string>('JWT_PRIVATEKEYPATH')!}`,
        );
        const publicKeyPath = resolve(
          __dirname,
          `../../../${configService.get<string>('JWT_PUBKEYPATH')!}`,
        );
        const privateKey = readFileSync(privateKeyPath, 'utf-8');
        const publicKey = readFileSync(publicKeyPath, 'utf-8');
        return {
          privateKey,
          publicKey,
          signOptions: {
            expiresIn: configService.get('JWT_GLOBAL_EXPIRES_IN'),
            algorithm: 'RS256',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [UxJwtService],
  exports: [UxJwtService],
})
export class UxJwtModule {}

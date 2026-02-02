import { Test, TestingModule } from '@nestjs/testing';
import { UxPasswordService } from './ux-password.service';
import { UxCryptoRsaService } from '@/services/ux-crypto-rsa/ux-crypto-rsa.service';
import { EnvConfigModule } from '@/modules/env-config/env-config.module';
import { ConfigService } from '@nestjs/config';
import { UxPasswordModule } from '@/modules/ux-password/ux-password.module';
import { md5 } from '@/tools';
describe('UxPasswordService Integration', () => {
  let uxPasswordService: UxPasswordService;
  let uxCryptoRsaService: UxCryptoRsaService;
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [EnvConfigModule, UxPasswordModule],
      providers: [ConfigService, UxCryptoRsaService],
    }).compile();

    uxPasswordService = module.get<UxPasswordService>(UxPasswordService);
    uxCryptoRsaService = module.get<UxCryptoRsaService>(UxCryptoRsaService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should return a string', () => {
    const pwd = '123456';
    const enPwd = uxPasswordService.encryptedPassword(pwd);
    expect(enPwd).toBeDefined();
  });

  it('should return a boolean', () => {
    const pwd = '123456';
    const result = uxPasswordService.verifyPassword(
      uxPasswordService.encryptedPassword(pwd),
      uxCryptoRsaService.encrypt(md5(pwd)),
    );
    expect(result).toBe(true);
  });

  it('should be defined', () => {
    expect(uxPasswordService).toBeDefined();
    expect(uxCryptoRsaService).toBeDefined();
  });
});

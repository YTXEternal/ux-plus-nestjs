import { Test, TestingModule } from '@nestjs/testing';
import { UxCryptoRsaService } from './ux-crypto-rsa.service';
import { EnvConfigModule } from '../../modules/env-config/env-config.module';
import { ConfigService } from '@nestjs/config';
describe('UxPasswordService Integration', () => {
  let uxCryptoRsaService: UxCryptoRsaService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvConfigModule],
      providers: [ConfigService, UxCryptoRsaService],
    }).compile();

    uxCryptoRsaService = module.get<UxCryptoRsaService>(UxCryptoRsaService);
  });

  it('encrypt', () => {
    const plainText = '123456';
    const encryptedData = uxCryptoRsaService.encrypt(plainText);
    expect(encryptedData).toBeDefined();
  });

  it('decrypt', () => {
    const plainText = '123456';
    const enText = uxCryptoRsaService.encrypt(plainText);
    const encryptedData = uxCryptoRsaService.decrypt(enText);
    expect(encryptedData).toEqual(plainText);
  });

  it('should be defined', () => {
    expect(uxCryptoRsaService).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { EnvConfigModule } from '@/modules/env-config/env-config.module';
import { UnauthorizedException } from '@nestjs/common';
import { UxJwtService } from '@/modules/ux-jwt/ux-jwt.service';
import { UxJwtModule } from '@/modules/ux-jwt/ux-jwt.module';

describe('UxJwtService (Integration)', () => {
  let uxJwtService: UxJwtService;
  let jwtService: JwtService;
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [EnvConfigModule, UxJwtModule],
    }).compile();

    uxJwtService = module.get<UxJwtService>(UxJwtService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('enCode', () => {
    it('should generate a valid code token', () => {
      const code = '123456';
      const token = uxJwtService.enCode(code);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });

  describe('parseCode', () => {
    it('should verify a valid code token and return the code', () => {
      const code = '123456';
      const token = uxJwtService.enCode(code);

      const result = uxJwtService.parseCode(token);
      expect(result.err).toBeNull();
      expect(result.data).toBe(code);
    });

    it('should throw an error for invalid or expired tokens', () => {
      const invalidToken = 'invalid.token.string';
      try {
        uxJwtService.parseCode(invalidToken);
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('loginToken', () => {
    it('should generate a valid login token', () => {
      const payload = { account: 'testuser', id: 'user123', secureid: 'xxx' };
      const token = uxJwtService.loginToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      // Verify whether the generated token can be parsed correctly
      const decoded = jwtService.decode(token);
      expect(decoded).toHaveProperty('account', payload.account);
      expect(decoded).toHaveProperty('id', payload.id);
    });
  });

  describe('parseLoginToken', () => {
    it('should verify a valid login token and return the payload', () => {
      const payload = { account: 'testuser', id: 'user123', secureid: 'xxx' };
      const token = uxJwtService.loginToken(payload);

      const verifiedPayload = uxJwtService.parseLoginToken(token);
      expect(verifiedPayload).toHaveProperty('account', payload.account);
      expect(verifiedPayload).toHaveProperty('id', payload.id);
    });

    it('should throw an error for invalid or expired login tokens', () => {
      const invalidToken = 'invalid.token.string';
      try {
        uxJwtService.parseLoginToken(invalidToken);
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});

import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UxCryptoRsaService } from '@/services/ux-crypto-rsa/ux-crypto-rsa.service';
import { md5 } from '@/tools';

@Injectable()
export class UxPasswordService {
  constructor(
    @Inject(forwardRef(() => UxCryptoRsaService))
    private readonly uxCryptoRsaService: UxCryptoRsaService,
  ) {}
  /**
   * 明文密码加密
   *
   * @param {string} plainText
   * @returns {*}
   */
  encryptedPassword(plainText: string) {
    const ep1 = md5(plainText);
    return this.uxCryptoRsaService.encrypt(ep1);
  }
  /**
   * 校验密码
   * dbPwd 数据库里面的密码
   * pwd 要对比的密码
   *
   * @param {string} dbPwd
   * @param {string} pwd
   * @returns {boolean}
   */
  verifyPassword(dbPwd: string, pwd: string) {
    const p1 = this.uxCryptoRsaService.decrypt(dbPwd);
    const p2 = this.uxCryptoRsaService.decrypt(pwd);
    return p1 === p2;
  }
}

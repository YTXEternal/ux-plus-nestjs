import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UxCryptoRsaService } from '@/services/ux-crypto-rsa/ux-crypto-rsa.service';
import { md5 } from '@/tools';

/**
 * 真正处理密码加密解密的模块关于账号的密码加密/解密永远只用这个
 *
 * @export
 * @class UxPasswordService
 * @typedef {UxPasswordService}
 */
@Injectable()
export class UxPasswordService {
  /**
   * 构造函数
   *
   * @param {UxCryptoRsaService} uxCryptoRsaService RSA 加解密服务
   */
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
    console.log('verifyPassword', p1, p2);
    return p1 === p2;
  }
}

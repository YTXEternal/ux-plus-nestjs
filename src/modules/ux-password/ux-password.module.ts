import { Module } from '@nestjs/common';
import { UxPasswordService } from './ux-password.service';
import { UxCryptoRsaService } from '@/services/ux-crypto-rsa/ux-crypto-rsa.service';

/**
 * 密码能力模块
 *
 * 装配密码加密/校验相关能力，对外导出 `UxPasswordService` 供业务模块使用。
 *
 * @export
 * @class UxPasswordModule
 * @typedef {UxPasswordModule}
 */
@Module({
  providers: [UxCryptoRsaService, UxPasswordService],
  exports: [UxPasswordService],
})
export class UxPasswordModule {}

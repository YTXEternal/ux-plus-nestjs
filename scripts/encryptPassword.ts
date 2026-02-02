/**
 * 密码加密脚本
 *
 * 用法: npx ts-node -r tsconfig-paths/register scripts/encryptPassword.ts <password>
 */
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { UxCryptoRsaService } from '../src/services/ux-crypto-rsa/ux-crypto-rsa.service';
import { UxPasswordService } from '../src/modules/ux-password/ux-password.service';

// Mock ConfigService
// UxCryptoRsaService 依赖 ConfigService.get 来获取环境变量
const mockConfigService = {
  get: (key: string) => process.env[key],
} as unknown as ConfigService;

async function main() {
  const password = process.argv[2];

  if (!password) {
    console.error('错误: 请提供要加密的密码作为参数。');
    console.error('用法: npx ts-node -r tsconfig-paths/register scripts/encryptPassword.ts <password>');
    process.exit(1);
  }

  try {
    // 手动实例化服务
    const rsaService = new UxCryptoRsaService(mockConfigService);
    const passwordService = new UxPasswordService(rsaService);

    // 执行加密
    const encrypted = passwordService.encryptedPassword(password);

    console.log('--------------------------------------------------');
    console.log(`明文密码: ${password}`);
    console.log(`加密结果: ${encrypted}`);
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error('加密过程中发生错误:', error);
    process.exit(1);
  }
}

main();

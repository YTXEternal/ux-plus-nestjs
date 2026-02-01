import { SetMetadata } from '@nestjs/common';

export const TIMEOUT_KEY = 'TIMEOUT_DECORATOR';

/**
 * 设置接口超时时间（单位：毫秒）
 * @param timeout 超时时间，单位：毫秒
 */
export const Timeout = (timeout: number) => SetMetadata(TIMEOUT_KEY, timeout);

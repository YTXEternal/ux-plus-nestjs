import { INestApplication } from '@nestjs/common';
import rateLimit from 'express-rate-limit';

export const useRateLimit = (app: INestApplication<any>) => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 分钟
    limit: 100000, // 限制每个 IP 在每个时间窗口内最多 100000 次请求（此处为 15 分钟）
    standardHeaders: false, // draft-6: RateLimit-* 响应头; draft-7 & draft-8: 组合 RateLimit 响应头
    legacyHeaders: false, // 禁用 X-RateLimit-* 响应头
    handler: (req, res, next, options) =>
      res.status(options.statusCode).send({
        code: options.statusCode,
        message: options.message as string,
      }),
  });
  app.use(limiter);
};

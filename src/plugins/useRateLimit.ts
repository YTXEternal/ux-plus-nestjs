import { INestApplication } from '@nestjs/common';
import rateLimit from 'express-rate-limit';

export const useRateLimit = (app: INestApplication<any>) => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: false, // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    handler: (req, res, next, options) =>
      res.status(options.statusCode).send({
        code: options.statusCode,
        message: options.message as string,
      }),
  });
  app.use(limiter);
};

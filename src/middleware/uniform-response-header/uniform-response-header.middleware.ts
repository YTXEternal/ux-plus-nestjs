import { Request, Response, NextFunction } from 'express';

export function uniformResponseHeaderMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.url.startsWith('/api')) {
    res.setHeader('Content-Type', 'application/json');
  }
  next();
}

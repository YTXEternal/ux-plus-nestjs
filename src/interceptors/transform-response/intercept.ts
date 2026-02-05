import { Type } from '@nestjs/common';
import { Expose, plainToClass } from 'class-transformer';
import { Info } from './modules/auth';

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
interface Intercept {
  [key: string]: InterceptItem;
}

type InterceptItem = {
  [key in Method]?: Type<any>;
};

const intercept: Intercept = {
  '/api/v1/auth/info': {
    GET: Info,
  },
};

export default intercept;

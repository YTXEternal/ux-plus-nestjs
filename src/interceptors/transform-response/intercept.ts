import { Type } from '@nestjs/common';
import { Info } from './modules/auth';
import { GeneralRoutes } from './modules/route';

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
  '/api/v1/route/getReactUserRoutes': {
    GET: GeneralRoutes,
  },
};

export default intercept;

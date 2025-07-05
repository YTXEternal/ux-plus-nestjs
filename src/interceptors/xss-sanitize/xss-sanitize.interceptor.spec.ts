import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { XssSanitizeInterceptor } from './xss-sanitize.interceptor';
import { Request } from 'express';
import { filterXss } from '@/tools';

describe('XssSanitizeInterceptor', () => {
  let interceptor: XssSanitizeInterceptor;
  let context: ExecutionContext;
  let callHandler: CallHandler;

  beforeEach(() => {
    interceptor = new XssSanitizeInterceptor();

    const mockRequest = {
      body: {
        name: '<script>alert("xss")</script>',
        nested: {
          description: '<b>bold</b>',
        },
      },
      query: {
        search: '<img src=x onerror=alert(1)>',
      },
      params: {
        id: '<div>evil</div>',
      },
    } as unknown as Request;

    context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    callHandler = {
      handle: () => of({ data: 'response' }).pipe(map((data) => data)),
    } as unknown as CallHandler;
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should sanitize body, query, and params using real filterXss', async () => {
      const result = await interceptor
        .intercept(context, callHandler)
        .toPromise();

      const expectedBody = {
        name: filterXss('<script>alert("xss")</script>'),
        nested: {
          description: filterXss('<b>bold</b>'),
        },
      };
      const expectedQuery = {
        search: filterXss('<img src=x onerror=alert(1)>'),
      };
      const expectedParams = {
        id: filterXss('<div>evil</div>'),
      };

      expect(context.switchToHttp().getRequest().body).toEqual(expectedBody);
      expect(context.switchToHttp().getRequest().query).toEqual(expectedQuery);
      expect(context.switchToHttp().getRequest().params).toEqual(
        expectedParams,
      );

      expect(result).toEqual({ data: 'response' });
    });

    it('should not sanitize when parameter is not an object', async () => {
      const mockRequest = {
        body: null,
        query: undefined,
        params: 123,
      } as unknown as Request;

      context = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as unknown as ExecutionContext;

      await interceptor.intercept(context, callHandler).toPromise();

      expect(context.switchToHttp().getRequest().body).toBe(null);
      expect(context.switchToHttp().getRequest().query).toBe(undefined);
      expect(context.switchToHttp().getRequest().params).toBe(123);
    });

    it('should not sanitize when parameter is empty object', async () => {
      const mockRequest = {
        body: {},
        query: {},
        params: {},
      } as unknown as Request;

      context = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as unknown as ExecutionContext;

      await interceptor.intercept(context, callHandler).toPromise();

      expect(context.switchToHttp().getRequest().body).toEqual({});
      expect(context.switchToHttp().getRequest().query).toEqual({});
      expect(context.switchToHttp().getRequest().params).toEqual({});
    });

    it('should recursively sanitize nested objects', async () => {
      const mockRequest = {
        body: {
          user: {
            profile: {
              bio: '<a href="javascript:alert(1)">link</a>',
            },
          },
        },
      } as unknown as Request;

      context = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as unknown as ExecutionContext;

      await interceptor.intercept(context, callHandler).toPromise();

      expect(mockRequest.body.user.profile.bio).toBe(
        filterXss('<a href="javascript:alert(1)">link</a>'),
      );
    });

    it('should not modify non-string values', async () => {
      const mockRequest = {
        body: {
          age: 25,
          isActive: true,
        },
      } as unknown as Request;

      context = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as unknown as ExecutionContext;

      await interceptor.intercept(context, callHandler).toPromise();

      expect(mockRequest.body.age).toBe(25);
      expect(mockRequest.body.isActive).toBe(true);
    });
  });
});

import {
  UnauthorizedException,
  HttpStatus,
  Injectable,
  HttpException,
} from '@nestjs/common';
import {
  JwtService,
  TokenExpiredError,
  NotBeforeError,
  JsonWebTokenError,
  JwtVerifyOptions,
} from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { LoginToken } from './types';

type E =
  | InstanceType<typeof TokenExpiredError>
  | InstanceType<typeof NotBeforeError>
  | InstanceType<typeof JsonWebTokenError>;
type VerifyCodeError = {
  name: string;
  message: string;
  code: number;
};

const handleError = (err: E): VerifyCodeError => {
  if (err.name === 'TokenExpiredError') {
    // Token 已过期
    return {
      name: 'TokenExpiredError',
      message: 'Token expired',
      code: HttpStatus.UNAUTHORIZED,
    };
  } else if (err.name === 'JsonWebTokenError') {
    // 无效的签名、格式错误等
    return {
      name: 'JsonWebTokenError',
      message: 'Invalid token signature or malformed token',
      code: HttpStatus.UNAUTHORIZED,
    };
  } else if (err.name === 'NotBeforeError') {
    // Token 尚未生效 (nbf 已设置)
    return {
      name: 'NotBeforeError',
      message: 'Token not active yet',
      code: HttpStatus.UNAUTHORIZED,
    };
  } else if (err.name === 'JwtInvalidSubjectError') {
    // 主题不匹配 (subject 不匹配)
    return {
      name: 'JwtInvalidSubjectError',
      message: 'Token subject does not match expected value',
      code: HttpStatus.BAD_REQUEST,
    };
  }
  return {
    name: 'UnknownJwtError',
    message: err.message || 'Unknown JWT verification error',
    code: HttpStatus.INTERNAL_SERVER_ERROR,
  };
};

/**
 * JWT 服务
 *
 * 提供验证码 Token 与登录 Token 的生成/解析能力，并对 JWT 校验错误进行结构化处理，统一抛出/返回业务可用结果。
 *
 * @export
 * @class UxJwtService
 * @typedef {UxJwtService}
 */
@Injectable()
export class UxJwtService {
  codeSubject: string = 'emailcode';
  tokenSubject: string = 'nestjs-token';
  /**
   * 构造函数
   *
   * @param {JwtService} jwtService JWT 底层服务
   * @param {ConfigService} configService 配置服务
   */
  constructor(
    public readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  /**
   * 生成验证码
   *
   * @param {string} code
   * @returns {string}
   */
  enCode(code: string): string {
    return this.jwtService.sign(
      {
        code,
      },
      {
        expiresIn: this.configService.get('JWT_REGISTRY_CODE_EXPIRES'),
        subject: this.codeSubject,
      },
    );
  }

  /**
   * 验证验证码 Token 并返回结构化结果
   *
   * @param {string} codeToken
   * @returns {{ data: string; err: UnauthorizedException | null; }}
   */
  parseCode(codeToken: string) {
    const r = verifyKit<{
      code: string;
    }>(this.jwtService, codeToken, {
      subject: this.codeSubject,
    });
    const code = r.data?.code;
    return {
      data: code,
      err: r.err ? new UnauthorizedException(r.err.message) : null,
    };
  }

  /**
   * 生成登录 Token
   *
   * @param {LoginToken} payload
   * @returns {string}
   */
  loginToken(payload: LoginToken) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_LOGIN_TOKEN_EXPIRES'),
      subject: this.tokenSubject,
    });
  }

  /**
   * 生成刷新 Token
   *
   * @param {LoginToken} payload
   * @returns {string}
   */
  refreshToken(payload: LoginToken) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES'),
      subject: this.tokenSubject,
    });
  }
  /**
   * 验证登录 Token
   *
   * @param {string} token
   * @returns {LoginToken}
   */
  parseLoginToken(token: string) {
    const { err, data } = verifyKit<LoginToken>(this.jwtService, token, {
      subject: this.tokenSubject,
    });
    if (err) throw new HttpException(err.message, err.code);
    return data;
  }
}

export function verifyKit<T extends object>(
  jwtService: JwtService,
  token: string,
  opt?: JwtVerifyOptions,
) {
  try {
    const decoded = jwtService.verify<
      T & {
        iat: number;
        exp: number;
        sub?: string;
      }
    >(token, opt);
    return { data: decoded, err: null };
  } catch (err) {
    const failObj = handleError(err as E);
    return { data: null, err: failObj };
  }
}

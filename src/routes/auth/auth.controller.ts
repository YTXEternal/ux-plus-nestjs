import {
  Controller,
  Post,
  Get,
  Body,
  HttpStatus,
  HttpCode,
  Req,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as ApiSwaggerResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  AuthLoginDto,
  LoginResult,
  UserInfoResult,
  RouterResult,
  RefreshTokenDto,
  RefreshTokenResult,
} from './dto/auth.dto';
import { UxJwtService } from '@/modules/ux-jwt/ux-jwt.service';
import { UxCryptoRsaService } from '@/services/ux-crypto-rsa/ux-crypto-rsa.service';
import { ApiResponse } from '@/dto/api-response';
import { RedisService } from '@/modules/redis/redis.service';
import { generateId } from '@/tools';
import { Request } from 'express';
import { Public } from '@/guards';
import { ConfigService } from '@nestjs/config';
import { SysUserService } from '@/routes/system/user/sys-user.service';
import { SysMenuService } from '@/routes/system/menu/sys-menu.service';
import { parseAuthToken } from '@/tools/parseAuthToken';

@ApiTags('认证管理')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly uxJwtService: UxJwtService,
    private readonly uxCryptoRsaService: UxCryptoRsaService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly sysUserService: SysUserService,
    private readonly sysMenuService: SysMenuService,
  ) {}

  @ApiOperation({ summary: '获取公钥' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Get public key successful' },
        data: {
          type: 'object',
          properties: {
            publicKey: {
              type: 'string',
              example: '-----BEGIN PUBLIC KEY-----\n...',
            },
          },
        },
      },
    },
  })
  @Public()
  @Get('/public-key')
  getPublicKey() {
    return new ApiResponse(HttpStatus.OK, 'Get public key successful', {
      publicKey: this.uxCryptoRsaService.pubkey,
    });
  }

  @ApiOperation({ summary: '用户登录' })
  @ApiSwaggerResponse({
    status: 200,
    description: '登录成功',
    type: ApiResponse,
  })
  @Public()
  @HttpCode(200)
  @Post('/login')
  async login(@Body() authLoginDto: AuthLoginDto, @Req() request: Request) {
    const user = await this.authService.validateCredentials(
      authLoginDto.user_name,
      authLoginDto.password,
    );

    const tokenId = generateId();
    const loginTokenExpires = 30 * 24 * 60 * 60; // 30 days

    // 存储在线用户信息
    const onlineUser = {
      user_id: user.user_id,
      tokenId,
      userName: user.user_name,
      ipaddr: request.ip || request.socket.remoteAddress,
      loginLocation: '', // TODO: 使用 IP 查询
      browser: '', // TODO: 使用 ua-parser-js 解析
      os: '', // TODO: 使用 ua-parser-js 解析
      loginTime: new Date(),
    };

    const redisBootUp = this.configService.get('REDIS_BOOT_UP') === 'true';
    if (redisBootUp) {
      try {
        await this.redisService.setCache(
          `login_tokens:${tokenId}`,
          onlineUser,
          loginTokenExpires,
        );
      } catch (e) {
        void e;
      }
    }

    // 生成 Token
    const payload = {
      id: user.user_id,
      account: user.user_name,
      tokenId,
    };
    const token = this.uxJwtService.loginToken(payload);
    const refreshToken = this.uxJwtService.refreshToken(payload);

    return new ApiResponse(HttpStatus.OK, 'Login successful', {
      token,
      refreshToken,
      apikey: user.apikey,
    });
  }

  @ApiOperation({ summary: '刷新令牌' })
  @ApiSwaggerResponse({
    status: 200,
    description: '刷新成功',
    type: RefreshTokenResult,
  })
  @Public()
  @HttpCode(200)
  @Post('/refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() request: Request,
  ) {
    console.log('refreshTokenDto', refreshTokenDto);
    // 验证 refresh token
    const user = await parseAuthToken({
      undisposedToken: refreshTokenDto.refreshToken,
      request: request,
      configService: this.configService,
      redisService: this.redisService,
      uxJwtService: this.uxJwtService,
      sysUserService: this.sysUserService,
    });
    // 生成 Token
    const tokenId = generateId();
    const payload = {
      id: user.user_id,
      account: user.userName,
      tokenId,
    };
    const token = this.uxJwtService.refreshToken(payload);
    return new ApiResponse(HttpStatus.OK, 'Refresh token successful', {
      token,
    });
  }

  @ApiOperation({ summary: '获取用户信息' })
  @ApiSwaggerResponse({ type: ApiResponse })
  @Get('/info')
  async info(@Req() request: Request) {
    const userPayload = (request as any).user;
    if (!userPayload) {
      throw new HttpException(
        'User not found in request',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userId = userPayload.user_id;
    // Fetch user with roles
    const { data: user } = await this.sysUserService.findOne(userId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const roleIds = user.roles?.map((r) => r.role_id) || [];
    const isAdmin = user.roles?.some((r) => r.role_key === 'SUPERADMIN');

    const permissions = await this.sysMenuService.selectPermsByRoleIds(
      roleIds,
      isAdmin,
    );

    const userBasicInfo = {
      nick_name: user.dataValues.nick_name,
      user_name: user.dataValues.user_name,
      avatar: user.dataValues.avatar,
      sex: user.dataValues.sex,
    };
    console.log('userBasicInfo', userBasicInfo);
    return new ApiResponse(HttpStatus.OK, 'Get user info successful', {
      user: userBasicInfo,
      roles: user.roles?.map((r) => r.role_key) || [],
      permissions,
    });
  }
}

import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Get,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as ApiSwaggerResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.dto';
import { UxJwtService } from '@/modules/ux-jwt/ux-jwt.service';
import { ApiResponse } from '@/dto/api-response';
import { RedisService } from '@/modules/redis/redis.service';
import { generateId } from '@/tools';
import { Request } from 'express';
import { Public } from '@/guards';
import { ConfigService } from '@nestjs/config';

@ApiTags('认证管理')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly uxJwtService: UxJwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

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
    const token = this.uxJwtService.loginToken({
      id: user.user_id,
      account: user.user_name,
      tokenId,
    });

    return new ApiResponse(HttpStatus.OK, 'Login successful', {
      token,
    });
  }

  @ApiOperation({ summary: '获取认证列表' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @ApiBearerAuth('bearer')
  @Get('list')
  list() {
    const list = [];
    return new ApiResponse(HttpStatus.OK, 'success', list);
  }
}

import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.dto';
import { UxJwtService } from '@/modules/ux-jwt/ux-jwt.service';
import { ApiResponse } from '@/dto/api-response';
import { AuthTokenGuard } from '@/guards';
import { RedisService } from '@/modules/redis/redis.service';
import { generateId } from '@/tools';
import { Request } from 'express';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly uxJwtService: UxJwtService,
    private readonly redisService: RedisService,
  ) {}

  @HttpCode(200)
  @Post('/login')
  async login(@Body() authLoginDto: AuthLoginDto, @Req() request: Request) {
    console.log('login', authLoginDto);
    const user = await this.authService.validateCredentials(
      authLoginDto.account,
      authLoginDto.password,
    );

    const tokenId = generateId();
    const loginTokenExpires = 30 * 24 * 60 * 60; // 30 days

    // Store online user info
    const onlineUser = {
      tokenId,
      userName: user.user_name,
      ipaddr: request.ip || request.socket.remoteAddress,
      loginLocation: '', // TODO: use ip lookup
      browser: '', // TODO: use ua-parser-js
      os: '', // TODO: use ua-parser-js
      loginTime: new Date(),
    };

    // Save to Redis
    await this.redisService.setCache(
      `login_tokens:${tokenId}`,
      onlineUser,
      loginTokenExpires,
    );

    // generate a token
    const token = this.uxJwtService.loginToken({
      id: user.user_id,
      account: user.user_name,
      tokenId,
    });

    return new ApiResponse(HttpStatus.OK, 'Login successful', {
      token,
    });
  }

  @Get('list')
  @UseGuards(AuthTokenGuard)
  list() {
    const list = [];
    return new ApiResponse(200, 'success', list);
  }
}

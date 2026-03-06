import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MysqlDatabaseModule } from './databases/mysql-database/mysql-database.module';
import { AuthModule } from './routes/auth/auth.module';
import { UxCryptoRsaService } from './services/ux-crypto-rsa/ux-crypto-rsa.service';
import { UxJwtModule } from './modules/ux-jwt/ux-jwt.module';
// import { RegistryModule } from './routes/registry/registry.module';
// import { RegistryCodeModule } from './routes/registry-code/registry-code.module';
import { EmailService } from './services/email/email.service';
import { HttpExceptionFilter } from './filter';
import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  HttpAdapterHost,
} from '@nestjs/core';
import { RedisModule } from './modules/redis/redis.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CpuOverloadProtectionService } from './modules/cpu-overload-protection/cpu-overload-protection.service';
import { StoreModule } from './modules/store/store.module';
import {
  IsProvideServiceGuard,
  AuthTokenGuard,
  PermissionsGuard,
} from './guards';
import { XssSanitizeInterceptor, TimeoutInterceptor } from './interceptors';
import { MongodbModule } from './databases/mongodb/mongodb.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { EnvConfigModule } from './modules/env-config/env-config.module';
import { UxPasswordModule } from './modules/ux-password/ux-password.module';
import { LoggerModule } from './modules/logger/logger.module';

// System Modules
import { SysUserModule } from './routes/system/user/sys-user.module';
import { SysPermissionModule } from './modules/permission/sys-permission.module';
import { SysRoleModule } from './routes/system/role/sys-role.module';
import { SysMenuModule } from './routes/system/menu/sys-menu.module';
import { SysDeptModule } from './routes/system/dept/sys-dept.module';
import { SysDictModule } from './routes/system/dict/sys-dict.module';
// Monitor Modules
import { SysOperLogModule } from './routes/monitor/operlog/sys-oper-log.module';
import { SysLogininforModule } from './routes/monitor/logininfor/sys-logininfor.module';
import { SysOnlineModule } from './routes/monitor/online/sys-online.module';
import { RouteModule } from './routes/route/route.module';
import { MemberModule } from './routes/member/member.module';
import { ShopModule } from './routes/shop/shop.module';
import { LabelModule } from './routes/label/label.module';
import { DramaModule } from './routes/drama/drama.module';
import { DramaPriceModule } from './routes/drama-price/drama-price.module';
import { SysFileModule } from './routes/file/file.module';
import { ArrangeModule } from './routes/arrange/arrange.module';
import { TicketModule } from './routes/ticket/ticket.module';

const staticPath = join(process.cwd(), 'static');
console.log('staticPath', staticPath);

const useProviders = () => {
  const data = [
    // CpuOverloadProtectionService,
    // {
    //   provide: APP_GUARD,
    //   useClass: IsProvideServiceGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: AuthTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: XssSanitizeInterceptor,
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    AppService,
    UxCryptoRsaService,
    EmailService,
    HttpAdapterHost,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ];
  const testData = [
    CpuOverloadProtectionService,
    {
      provide: APP_GUARD,
      useClass: IsProvideServiceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: XssSanitizeInterceptor,
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    AppService,
    UxCryptoRsaService,
    EmailService,
    HttpAdapterHost,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ];
  return process.env.NODE_ENV === 'test' ? testData : data;
};

/**
 * 应用根模块
 *
 * 负责装配全局基础设施模块与各业务路由模块，并注册全局 Guard / Interceptor / Filter 等能力。
 *
 * @export
 * @class AppModule
 * @typedef {AppModule}
 */
@Module({
  imports: [
    EnvConfigModule,
    LoggerModule,
    ServeStaticModule.forRoot({
      rootPath: staticPath,
      serveRoot: '/static',
    }),
    ScheduleModule.forRoot(),
    UxJwtModule,
    MysqlDatabaseModule.forRoot(),
    AuthModule,
    // RegistryCodeModule,
    RedisModule,
    // RegistryModule,
    StoreModule,
    MongodbModule.register(),
    UxPasswordModule,
    // System
    SysUserModule,
    SysPermissionModule,
    SysRoleModule,
    SysMenuModule,
    SysDeptModule,
    SysDictModule,
    // Monitor
    SysOperLogModule,
    SysLogininforModule,
    SysOnlineModule,
    RouteModule,
    MemberModule,
    ShopModule,
    LabelModule,
    DramaModule,
    DramaPriceModule,
    SysFileModule,
    ArrangeModule,
    TicketModule,
  ],
  controllers: [AppController],
  providers: useProviders(),
})
export class AppModule {}

---
alwaysApply: false
description: 安全与最佳实践
---
# 安全和最佳实践
## 密码
- 流程：前端明文→RSA；后端解密→MD5→RSA存；校验：库密文解密→MD5对比，这个直接使用`@/modules/ux-password`模块即可
- 禁止：记明文/泄露细节/弱算法
## JWT
- RS256；含 `sub`：`nestjs-token`（登录）/ `emailcode`（验证码）
- 头：`Authorization: Bearer <token>`；鉴权用 `@UseGuards(AuthTokenGuard)`
## 输入安全
- `XssSanitizeInterceptor` 全局过滤 body/query/params；禁渲染未过滤输入/SQL拼接
- 限流：`express-rate-limit`（`useRateLimit` 插件配置）
## 环境变量
- `EnvConfigModule` 统一管理；敏感信息仅 env，禁提交
- 必需：`JWT_*`（key/exp）、`RSA_*`（key/passphrase）、`MYSQL_*`（host/port/user/pass/db）
## CPU 过载保护
- `CPU_BASE_PROBABILITY`（默认0.7）、`CPU_MAX_THRESHOLD`（默认640）
- 3 秒采样；超阈值动态丢弃；`IsProvideServiceGuard` 启用；测试禁用
## 禁止清单
- 禁止：硬编码密钥/密码；生产启用 Swagger；打敏感日志；暴露内部错误；跳过校验
- 禁止：controller 直连 DB；service 直接用响应对象；生产 `console.log`；循环查库（N+1）

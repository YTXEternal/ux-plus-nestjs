---
alwaysApply: false
description: 描述安全和最佳实践规范
---
# 安全和最佳实践

## 密码处理规范

### 加密流程
1. **前端**: 明文密码 → RSA 加密
2. **后端接收**: RSA 解密 → MD5 哈希 → RSA 加密存储
3. **验证**: 数据库密码 RSA 解密 → MD5 → 对比传入密码的 MD5

```typescript
// 注册时加密
const enPassword = this.uxPasswordService.encryptedPassword(password);

// 登录时验证
const isPass = this.uxPasswordService.verifyPassword(
  result.password,  // 数据库存储的加密密码
  enPassword        // 前端传来的 RSA 加密密码
);
```

### 禁止事项
- ❌ 不要在日志中记录明文密码
- ❌ 不要在错误消息中暴露密码信息
- ❌ 不要使用弱加密算法

## JWT 使用规范

### Token 生成
```typescript
// 登录 Token
const token = this.uxJwtService.loginToken({
  id,
  account,
  secureid,
});

// 验证码 Token
const codeToken = this.uxJwtService.enCode(code);
```

### Token 验证
- 使用 RS256 算法（非对称加密）
- Token 必须包含 `subject` (sub) 字段
- 不同用途使用不同的 subject:
  - `nestjs-token` - 登录 Token
  - `emailcode` - 邮箱验证码

### Token 格式
```
Authorization: Bearer <token>
```

### 守卫使用
```typescript
@Get('list')
@UseGuards(AuthTokenGuard)  // 需要 Token 验证
list() { }
```

## XSS 防护规范

### 自动过滤
- 所有请求参数（body, query, params）自动经过 XSS 过滤
- 使用 `XssSanitizeInterceptor` 全局拦截器
- 无需手动处理，系统自动过滤

### 禁止事项
- ❌ 不要在前端渲染未过滤的用户输入
- ❌ 不要在 SQL 查询中直接拼接用户输入

## 速率限制规范

- 使用 `express-rate-limit` 中间件
- 在 `useRateLimit` 插件中配置
- 防止 API 滥用和 DDoS 攻击

## 环境变量安全

### 配置管理
- 使用 `EnvConfigModule` 统一管理环境变量
- 敏感信息（密钥、密码）必须通过环境变量配置
- 不要将敏感信息提交到代码仓库

### 必需的配置项
```typescript
// JWT 配置
JWT_PRIVATEKEYPATH
JWT_PUBKEYPATH
JWT_GLOBAL_EXPIRES_IN
JWT_LOGIN_TOKEN_EXPIRES
JWT_REGISTRY_CODE_EXPIRES

// RSA 配置
PUBKEYPATH
PRIVATEKEYPATH
PASSPHRASE

// 数据库配置
MYSQL_HOST
MYSQL_PORT
MYSQL_USERNAME
MYSQL_PASSWORD
MYSQL_DATABASE
```

## CPU 过载保护规范

### 配置参数
```typescript
CPU_BASE_PROBABILITY   // 基础丢弃概率（0~1），默认 0.7
CPU_MAX_THRESHOLD      // CPU 使用率阈值（百分比），默认 640
```

### 工作机制
- 每 3 秒监控一次 CPU 使用率
- 超过阈值时动态计算丢弃概率
- 使用 `IsProvideServiceGuard` 全局守卫启用
- 测试环境自动禁用

## API 设计安全

### 验证和授权
- 所有需要认证的接口使用 `@UseGuards(AuthTokenGuard)`
- 敏感操作（如密码修改）需要额外的安全验证
- 使用 `secureid` 增强安全性

### 错误处理
- 不要暴露敏感的系统信息
- 错误消息要明确但不泄露内部细节
- 使用统一的异常过滤器处理错误

## 禁止事项清单

### 安全相关
- ❌ 不要在代码中硬编码密码、密钥等敏感信息
- ❌ 不要在生产环境启用 Swagger（已自动处理）
- ❌ 不要记录敏感信息到日志
- ❌ 不要在错误消息中暴露系统内部信息
- ❌ 不要跳过输入验证
- ❌ 不要使用不安全的加密算法

### 代码质量
- ❌ 不要在控制器中直接操作数据库，必须通过服务层
- ❌ 不要在服务层直接使用响应对象，使用 `ApiResponse` 类
- ❌ 不要在测试环境启用 CPU 过载保护守卫
- ❌ 不要在生产代码中使用 `console.log`，使用 `Logger`
- ❌ 不要在循环中执行数据库查询，使用批量操作

## 最佳实践

### 代码组织
- ✅ 使用依赖注入管理依赖关系
- ✅ 遵循单一职责原则
- ✅ 使用事务确保数据一致性
- ✅ 合理使用守卫、拦截器、过滤器
- ✅ 为所有公共 API 编写测试

### 性能优化
- ✅ 使用 Redis 缓存热点数据
- ✅ 合理使用数据库索引
- ✅ 避免 N+1 查询问题
- ✅ 使用连接池管理数据库连接

### 可维护性
- ✅ 保持代码简洁，避免过度设计
- ✅ 使用类型安全的方式处理数据
- ✅ 错误处理要有明确的错误消息
- ✅ 添加必要的注释和文档

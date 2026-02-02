## 目标与范围
- 覆盖目录：`src/exceptions`、`src/filter`、`src/guards`、`src/interceptors`、`src/middleware`、`src/modules`、`src/services`
- 用例要求：按 `describe/it` 分层；成功/失败/边界；不影响 MySQL/Redis/MongoDB 等外部数据
- 验收：`pnpm test` 全绿后再跑 `pnpm lint` 并通过

## 现状盘点（已存在的测试）
- 已有：
  - exceptions：[validate-dto-exception.spec.ts](file:///d:/data/development/Projects/NestJS_React_StoreManagement/ux-plus-nestjs/src/exceptions/validate-dto/validate-dto-exception.spec.ts)
  - filter：[http-exception.filter.spec.ts](file:///d:/data/development/Projects/NestJS_React_StoreManagement/ux-plus-nestjs/src/filter/http-exception/http-exception.filter.spec.ts)
  - guards：[is-provide-service.guard.spec.ts](file:///d:/data/development/Projects/NestJS_React_StoreManagement/ux-plus-nestjs/src/guards/is-provide-service/is-provide-service.guard.spec.ts)
  - interceptors：[xss-sanitize.interceptor.spec.ts](file:///d:/data/development/Projects/NestJS_React_StoreManagement/ux-plus-nestjs/src/interceptors/xss-sanitize/xss-sanitize.interceptor.spec.ts)
  - middleware：[uniform-response-header.middleware.spec.ts](file:///d:/data/development/Projects/NestJS_React_StoreManagement/ux-plus-nestjs/src/middleware/uniform-response-header/uniform-response-header.middleware.spec.ts)
  - modules：cpu-overload-protection/store/ux-jwt/ux-password 已有 spec
  - services：ux-crypto-rsa 已有 spec
- 明显缺口（需要新增 spec 文件或显著扩展）：
  - guards：auth-token、permissions
  - interceptors：timeout
  - modules：redis.service、permission/sys-permission.service（以及可选：env-config/logger/module 级别的“可编译性/基础行为”测试）
  - services：email.service

## 外部依赖隔离策略（不碰 DB/Redis）
- 原则：单元测试不引入 `AppModule`，只对目标类注入 Mock Provider；禁止真实网络/数据库连接。
- 关键点：
  - 对 `AuthTokenGuard`：完全 mock `UxJwtService`、`RedisService`、`SysUserService`、`ConfigService`、`Reflector`，避免落到 MySQL/Redis。
  - 对 `SysPermissionService`：mock `roleModel/menuModel/userModel` 的 `findOne/findAll`，返回内存数据结构。
  - 对 `EmailService`：`jest.mock('nodemailer')`，让 `createTransport().sendMail` 只走 stub。
  - 若任何测试需要 import 读取 env 的模块（如 `RedisModule` 会在模块加载时读取 `process.env.REDIS_BOOT_UP`），统一改为“设置 env 后再动态 import”，避免被 dotenv 初始化时锁死。

## 具体新增/补强测试清单
- guards/auth-token
  - 新建 `auth-token.guard.spec.ts`：
    - Public 路由直接放行
    - Authorization 为空/格式不对/Bearer 缺 token -> `UnauthorizedException`
    - `parseLoginToken` 抛错 -> `UnauthorizedException`
    - `sub` 不匹配 -> `UnauthorizedException`
    - Redis 正常命中用户 -> 放行并把 user 挂到 request
    - Redis 读失败 -> 回退 DB（mock `sysUserService.findOne`）
    - DB 用户被删除/停用/不存在 -> `Token expired or user forced logout.`
- guards/permissions
  - 新建 `permissions.guard.spec.ts`：
    - Public 放行
    - 未声明权限（未设置装饰器元数据）放行
    - request.user 缺失 -> `ForbiddenException`
    - perms 含 `*:*:*` 放行
    - perms 含 requiredPermission 放行
    - perms 不包含 -> `ForbiddenException`（校验 message）
- interceptors/timeout
  - 新建 `timeout.interceptor.spec.ts`：
    - 装饰器 timeout 优先于全局配置
    - 未设置装饰器时使用全局默认值
    - 超时触发 -> `RequestTimeoutException`
    - 下游抛非 TimeoutError -> 原样透传
- modules/redis/redis.service
  - 新建 `redis.service.spec.ts`：
    - `getCatche`：key 不存在返回 undefined；存在返回解析后的对象/或 isparse=false 返回字符串
    - `setCache`：带/不带 expiretime 的 set 调用参数正确
    - `selectOne/selectAll`：命中缓存直接返回；不命中时调用模型 findOne/findAll；缓存策略（默认/自定义 isCacheCb）覆盖边界
- modules/permission/sys-permission.service
  - 新建 `sys-permission.service.spec.ts`：
    - isAdmin 用户：直接返回 admin 角色集合
    - 普通用户：findOne 返回 roles -> 集合正确
    - SUPERADMIN 角色 -> perms 含 `*:*:*`
    - 非 SUPERADMIN：findAll 返回 menus/perms，过滤空 perms，去重
    - 角色为空/menus 为空 -> 返回空集合
- services/email/email.service
  - 新建 `email.service.spec.ts`：
    - sendRegistryCode 成功：sendMail 被正确调用（to/subject/text/html）且返回 true
    - sendMail 失败：logger.error 被调用且错误继续抛出
- 对已存在 spec 做增强（按需要）
  - 视 `pnpm test` 的覆盖/失败情况，补充边界分支（例如 filter/interceptor 的特殊输入、header 缺失、XSS 过滤边界等）。

## 运行与修复闭环
- 依次执行并修复：
  - `pnpm test`：若失败，优先判断是新测写法问题还是源代码 bug；必要时修复源代码并补齐对应测试。
  - `pnpm lint`：按项目 ESLint 规则修正风格问题，确保全绿。

## 关键前置约束（需要你确认）
- 当前工作区规则里存在“现在不允许生成测试文件”。本任务要“完成这些文件夹下的单元测试”不可避免需要新增 `*.spec.ts` 文件。
- 你确认允许我在 `src/**` 下新增上述缺失的 `*.spec.ts` 单测文件后，我再开始落地实现并跑 `pnpm test`/`pnpm lint`。
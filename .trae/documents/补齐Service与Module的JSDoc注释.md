## 需求理解
- Service：每一个方法都必须有对应的 JSDoc 注释（含 constructor、生命周期方法、业务方法；如存在 private 方法也一并补齐）。
- Module：每一个 Module 类都必须有 JSDoc 注释，说明该模块的职责/提供的能力。
- 注释语言：简体中文；格式：JSDoc；不改动现有业务逻辑，仅补齐/完善注释。

## 现状核查（只读结论）
- `src/` 下共发现 `*.service.ts` 21 个、`*.module.ts` 22 个。
- Module：22/22 缺少 Module 类注释。
- Service：大量 Service 缺少类注释；系统/监控相关 CRUD Service 几乎所有方法都缺少方法级 JSDoc。

## 实施策略
- 统一注释模板：沿用项目现有风格（如 `UxPasswordService`、`UxJwtService` 的写法），每个方法至少包含：一句话说明、`@param`、`@returns`（必要时补 `@throws`/`@example`）。
- Module 类注释包含：模块用途、核心 providers/controllers、对外导出能力（如有 exports）。
- Service 类注释包含：该 Service 的职责、依赖项（如注入的 service/repository）、主要方法概览。

## 具体修改范围（按优先级）
1. 补齐所有 `*.module.ts` 的 Module 类 JSDoc（包含 `AppModule`、数据库/缓存/日志模块、各业务路由模块）。
2. 补齐缺少类注释的 Service（如 `AuthService`、`EmailService`、`RedisService`、系统/监控 CRUD Service 等）。
3. 补齐缺少方法注释的 Service 方法（CRUD 方法、Token/验证码、缓存读写、加解密、CPU 监控生命周期方法等）。

## 验证方式
- 运行 ESLint 检查，确保新增注释不引入格式/规则问题。
- 运行单元测试（如仓库已有测试），确保无任何功能回归。
- 如存在 Swagger/类型检查相关构建步骤，一并执行以确认编译通过。

## 交付结果
- 所有 Service 方法与所有 Module 类满足规则要求：完整 JSDoc（简体中文）覆盖。
- 变更仅为注释补齐/完善，不包含任何业务逻辑改动。
## 目标
- 在 `./test` 下使用现有的 [app.e2e-spec.ts](file:///d:/data/development/Projects/NestJS_React_StoreManagement/ux-plus-nestjs/test/app.e2e-spec.ts) 完成“所有接口”的端到端测试。
- 登录账号使用“超级管理员”账号（默认文档为 `admin/admin123`），并对所有需要鉴权的接口统一带上 `Authorization: Bearer <token>`。
- 测试过程不对“当前数据库”造成任何损害：不改动现有库数据，且测试结束后数据库不留痕。

## 关键调研结论（用于约束实现）
- 当前 `src/routes` 下共有 12 个 Controller，需要覆盖的接口见扫描清单（auth + system/* + monitor/*）。
- 鉴权头由 [AuthTokenGuard](file:///d:/data/development/Projects/NestJS_React_StoreManagement/ux-plus-nestjs/src/guards/auth-token/auth-token.guard.ts#L34-L46) 解析 `Authorization: Bearer <token>`。
- 登录 DTO 字段为 `user_name` / `password`（[auth.dto.ts](file:///d:/data/development/Projects/NestJS_React_StoreManagement/ux-plus-nestjs/src/routes/auth/dto/auth.dto.ts#L4-L14)）。
- 登录密码按前端逻辑传“RSA(public) 加密后的 md5(明文)”（当前 e2e 文件已实现 `encryptLoginPassword`）。
- 当前 e2e 示例存在 `sequelize.sync({ force: true })`（[app.e2e-spec.ts](file:///d:/data/development/Projects/NestJS_React_StoreManagement/ux-plus-nestjs/test/app.e2e-spec.ts#L130)）会清库重建，不符合“不能损伤当前数据库”的要求。
- `AuthController.login` 当前强依赖 Redis 写入在线信息（[auth.controller.ts](file:///d:/data/development/Projects/NestJS_React_StoreManagement/ux-plus-nestjs/src/routes/auth/auth.controller.ts#L64-L69)），`SysOnlineService` 也直接调用 redis（[sys-online.service.ts](file:///d:/data/development/Projects/NestJS_React_StoreManagement/ux-plus-nestjs/src/routes/monitor/online/sys-online.service.ts#L12-L37)）；若测试环境未启动 redis，e2e 可能不稳定，需要做容错。

## 实现方案（E2E 测试不留痕）
1. **为每次 e2e 运行创建独立 MySQL 数据库**
   - 在 `beforeAll` 中使用 `mysql2/promise` 读取 `.env.test` 的 MySQL 连接信息，创建数据库：`platform_test_e2e_<runId>`。
   - 在创建 Nest 应用前设置 `process.env.MYSQL_DATABASE` 指向该临时库，并将 `CPU_BASE_PROBABILITY=0`，保证测试稳定。
   - 将 `AppModule` 改为“动态导入”（`await import('@/app.module')`），确保 Sequelize 使用新的 `MYSQL_DATABASE`。
   - 在 `afterAll` 中：先 `await app.close()` 释放连接，再 `DROP DATABASE platform_test_e2e_<runId>`，实现完全不留痕。

2. **在临时库内准备超级管理员账号（与线上一致的用户名）**
   - 优先使用 `admin/admin123` 作为超级管理员账号（文档说明）。
   - 若库内不存在 `admin`：创建 `SysDept`、`SysRole(role_key='SUPERADMIN')`、`SysUser(user_name='admin')` 并绑定 `sys_user_role`。
   - 若已存在：仅确保其具备 `SUPERADMIN` 角色（必要时补充绑定）。

3. **按模块分 describe，并覆盖模块内所有接口的成功/失败用例**
   - **Auth**：
     - `POST /auth/login`：成功拿 token；失败（密码错误 / 缺字段）。
     - `GET /auth/list`：成功（携带 token）；失败（不带 token -> 401）。
   - **System - Config/Dept/Dict/Menu/Notice/Post/Role/User**：
     - 每个模块按接口逐个测试：list/query/get-by-id/create/update/delete。
     - 失败场景至少覆盖：
       - 不带 token -> 401
       - body 缺关键字段 -> 400（由 DTO/校验触发）
       - 查询不存在 id -> 200/404（按实际实现断言，确保行为一致且可预期）
   - **Monitor - Online/OperLog/Logininfor**：
     - Online：list + forceLogout（并验证被踢后访问需要重新登录/或 token 失效，按实际实现断言）。
     - OperLog/Logininfor：list + remove + clean + unlock（由于使用独立临时库，clean 不会影响任何现有数据）。

## 对服务端的必要健壮性修复（以保证 e2e 在无 Redis 环境也能跑）
- 在不改变业务语义的前提下：
  - `AuthController.login`：当 `REDIS_BOOT_UP=false` 或 Redis 写入失败时，跳过写 Redis（或 try/catch 回退），仍返回 token。
  - `SysOnlineService`：当 `REDIS_BOOT_UP=false` 或 Redis 不可用时，`findAll` 返回空列表、`forceLogout` 返回 0（或明确的可预期响应），避免 500。

## 验证步骤
- 修改完成后，按你的要求依次执行并反复修复直至通过：
  - `pnpm test:e2e`（若失败：定位是测试用例问题还是接口实现问题，必要时修复接口/DTO/状态码/容错逻辑）
  - `pnpm lint`（修复所有 lint 问题）

如果你确认以上方案，我会开始进行代码修改与实际跑测，直到 `pnpm test:e2e` 与 `pnpm lint` 都通过。
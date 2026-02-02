---
alwaysApply: true
---
# 项目结构规范

## 目录结构

- `src/databases/`：数据库（MongoDB/MySQL）
- `src/routes/`：业务模块（controller/service/module + dto/types）
- `src/modules/`：可复用；`src/services/`：独立服务
- `src/guards|interceptors|filters|middleware|plugins/`：通用能力
- `src/dto|exceptions|tools|test-tools/`：公共 DTO / 异常 / 工具 / 测试工具

## 模块文件组织

- 路由模块（`src/routes/*`）：`dto/`、`types/`、`tests/`（可选）+ `*.controller.ts` / `*.service.ts` / `*.module.ts`
- 功能模块（`src/modules/*`、`src/services/*`）：`types/`、`tests/`（可选）+ `*.service.ts` / `*.module.ts`；需要聚合导出再加 `index.ts`

## 导出规范

- 需要聚合导出时创建 `index.ts`：`export * from './xxx';`
- 工具函数：一文件一函数，统一由 `tools/index.ts` 导出；命名：`generate*` / `filter*` / `is*` / `to*`

## 路径别名

- `@/*` -> `src/*`；导入优先用别名，避免 `../../../`

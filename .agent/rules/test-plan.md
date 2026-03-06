---
alwaysApply: false
description: 测试计划描述，当你不理解测试计划规范时可通过当前文件理解
---
# 测试方案

## 单元测试
- 当你编写`src/execpetions`、 `src/modules`、`src/routes`、`src/services`、`src/tools`、`src/guards`、 `src/interceptors`、`src/filters`、`src/middlewares`等时必须编写对应的单元测试。

## 端到端测试
- 端到端测试在项目根目录的`test`目录下。
- 当你编写`src/routes`增加接口或者修改接口实际的运行逻辑时需要编写对应的端到端测试（在`/test/app.e2e-spec.ts`文件中续写）。

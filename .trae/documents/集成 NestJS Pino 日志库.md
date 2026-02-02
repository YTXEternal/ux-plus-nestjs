# 集成 NestJS Pino 日志库计划

我将为你集成 `nestjs-pino` 和 `pino-pretty`，以实现高性能且美观的日志输出。

## 1. 安装依赖
首先需要安装核心库 `nestjs-pino`、`pino-http` 以及开发环境使用的美化库 `pino-pretty`。

```bash
pnpm add nestjs-pino pino-http
pnpm add -D pino-pretty
```

## 2. 配置 `AppModule`
在 `src/app.module.ts` 中引入并配置 `LoggerModule`。

- **配置策略**：
    - 在非生产环境（开发/测试）启用 `pino-pretty` 进行日志美化。
    - 生产环境保持默认的 JSON 格式，以获得最佳性能和可观测性。
    - 自动记录 HTTP 请求和响应信息（nestjs-pino 的核心特性）。

## 3. 更新 `main.ts`
修改应用启动文件 `src/main.ts` 以启用全局日志记录器。

- **修改内容**：
    - 设置 `bufferLogs: true`：确保 NestJS 启动过程中的日志也能被 Pino 接管。
    - 使用 `app.useLogger(app.get(Logger))`：将 Pino 设置为应用的全局 Logger。

## 4. 验证
集成完成后，启动应用，控制台应显示格式化后的彩色日志，且包含请求 ID 等结构化信息。

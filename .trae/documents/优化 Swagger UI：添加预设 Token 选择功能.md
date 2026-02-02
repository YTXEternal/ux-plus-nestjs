# Swagger UI 体验优化计划

为了解决 Swagger UI 测试接口时 Token 填写繁琐的问题，我将通过以下步骤进行优化：

## 1. 升级鉴权配置机制
目前的 `useSwagger.ts` 通过手动给每个接口添加 `Authorization` Header 参数的方式来实现鉴权，这种方式在 Swagger UI 上无法使用全局的 "Authorize" 按钮，体验较差。
- **操作**：修改 `src/plugins/useSwagger.ts`。
- **细节**：
    - 在 `DocumentBuilder` 中启用标准的 `.addBearerAuth()` 配置。
    - 移除原本“手动添加 Authorization 参数”的遍历逻辑。
    - 改为遍历接口，为非 Auth 接口自动添加 `security: [{ 'bearer': [] }]` 定义。这样 Swagger UI 顶部会出现统一的 Authorize 按钮。

## 2. 注入自定义脚本实现“预设 Token 选择”
利用 NestJS Swagger 模块的 `customJsStr` 属性，向 Swagger UI 页面注入一段 JavaScript 代码。
- **功能**：
    - 在 Swagger UI 的顶部导航栏区域动态插入一个下拉选择框。
    - 下拉框中包含预设的 Token 选项（如“超级管理员”、“普通用户”等）。
    - 当用户选择某个选项时，自动调用 Swagger 内部 API 完成鉴权，免去手动复制粘贴的步骤。
- **配置**：我会在代码中预留 Token 配置数组，您可以直接将常用的测试 Token 填入其中。

## 3. 验证与交付
- **验证**：确保 Swagger UI 正常加载，顶部出现下拉框，且选择后能正确设置 Authorization Header。
- **交付**：修改后的 `useSwagger.ts` 文件。

### 待确认
- 您是否有现成的测试 Token 需要我预置进去？如果没有，我将使用占位符，您后续可自行替换。

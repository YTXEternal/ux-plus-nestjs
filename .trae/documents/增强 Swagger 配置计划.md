我已完成对当前 Swagger 配置的分析，并准备为您进行增强配置。

### 分析结果
当前的 `src/plugins/useSwagger.ts` 配置较为基础，仅包含简单的标题、描述和 Bearer 认证。
通过结合 `package.json` 中的项目信息，我们可以使文档更加专业和完整。

### 计划修改内容
我将修改 `src/plugins/useSwagger.ts` 文件，进行以下增强：

1.  **完善基础元数据 (DocumentBuilder)**：
    *   **标题 (Title)**：修改为 `UX Plus NestJS API`（参考项目名）。
    *   **描述 (Description)**：使用 `package.json` 中的详细中文描述。
    *   **版本 (Version)**：更新为 `1.1.6`。
    *   **联系人 (Contact)**：添加作者 `ux_rcl` 及相关信息。
    *   **许可证 (License)**：添加 `MIT` 许可证信息。
    *   **服务节点 (Servers)**：明确添加本地开发环境地址 `http://localhost:3000/api`。

2.  **增强 Swagger UI 体验 (SwaggerModule.setup)**：
    *   **折叠显示 (docExpansion)**：设置为 `'none'`，默认折叠所有接口，让文档结构更清晰。
    *   **搜索功能 (filter)**：开启搜索框，方便快速查找接口。
    *   **请求耗时 (showRequestDuration)**：显示接口请求耗时，便于调试。
    *   **排序 (sorter)**：
        *   `tagsSorter: 'alpha'`：标签按字母/拼音排序。
        *   `operationsSorter: 'alpha'`：接口按字母/拼音排序。

### 预期效果
修改后，您的 API 文档将拥有更详细的项目信息，界面交互更加友好（支持搜索、折叠），并且符合项目的整体规范。

请确认是否执行此计划。
# Swagger 接口文档补全计划

我将修改 `src/plugins/useSwagger.ts` 文件，通过在 Swagger 文档生成后对文档对象进行后处理，来实现您的需求。

## 修改内容
1.  **全局添加 Content-Type 头**：
    - 遍历所有接口路径。
    - 为每个接口添加 `Content-Type` 请求头参数，默认值设为 `application/json`。
2.  **条件添加 Authorization 头**：
    - 遍历所有接口路径。
    - 判断路径是否属于认证模块（匹配 `/auth/` 或以 `/auth` 结尾）。
    - 对**非认证模块**的接口，添加 `Authorization` 请求头参数，默认值设为 `{{超级管理员token}}`。

## 实现逻辑
在 `SwaggerModule.createDocument` 生成文档后，但在 `fs.writeFileSync` 和 `SwaggerModule.setup` 之前，插入一段逻辑来遍历并修改 `document.paths` 对象。

这样生成的 `swagger.json` 文件和在线 Swagger 文档都将包含这些配置，方便导入 Postman 或直接测试。
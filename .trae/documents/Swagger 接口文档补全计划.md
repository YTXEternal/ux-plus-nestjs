这是一个为项目全面补充 Swagger 接口文档的执行计划。目前项目已配置 Swagger 插件，但 Controller 和 DTO 缺少装饰器，导致文档信息缺失。

**执行原则**：
1.  **全局统一**：首先完善通用的响应对象文档。
2.  **模块化推进**：按业务模块（Auth、System、Monitor）逐个完善。
3.  **DTO 规范化**：针对 `Delete` 接口目前的内联 Body 定义（如 `{ user_ids: number[] }`），提取为正式的 DTO 类，以确保 Swagger 能正确展示请求参数。

---

### 1. 全局 DTO 完善
*   **目标文件**: `src/dto/api-response.ts`
*   **操作**: 为 `ApiResponse` 类及其属性添加 `@ApiProperty` 装饰器，定义通用的 API 响应结构（code, message, data）。

### 2. Auth 模块 (认证)
*   **DTO**: `src/routes/auth/dto/auth.dto.ts`
    *   完善 `AuthLoginDto`，添加字段描述。
*   **Controller**: `src/routes/auth/auth.controller.ts`
    *   添加 `@ApiTags('认证管理')`。
    *   为 `/login` 等接口添加 `@ApiOperation` 和 `@ApiResponse`。

### 3. System 模块 (系统管理)
将依次处理以下子模块：`User` (用户), `Role` (角色), `Menu` (菜单), `Dept` (部门), `Post` (岗位), `Dict` (字典), `Config` (参数), `Notice` (通知)。

**通用操作步骤**（以 User 为例）：
1.  **DTO 完善**:
    *   修改 `src/routes/system/user/dto/sys-user.dto.ts`，为所有 DTO 属性添加 `@ApiProperty`。
    *   **新增** `DeleteUserDto` (及其他模块对应的 Delete DTO)，替代 Controller 中的内联类型定义，确保文档清晰。
2.  **Controller 完善**:
    *   修改 `src/routes/system/user/sys-user.controller.ts`。
    *   添加 `@ApiTags('系统管理-用户管理')`。
    *   为所有 CRUD 方法添加 `@ApiOperation`（如"获取用户列表"、"删除用户"）。
    *   为所有方法添加 `@ApiResponse`，指定返回类型。

### 4. Monitor 模块 (系统监控)
将依次处理以下子模块：`LoginInfor` (登录日志), `Online` (在线用户), `OperLog` (操作日志)。

**通用操作步骤**：
1.  **DTO 完善**: 更新对应的 `.dto.ts` 文件，添加 `@ApiProperty`。
2.  **Controller 完善**: 更新对应的 `.controller.ts` 文件，添加 `@ApiTags`（如'系统监控-登录日志'）和方法级装饰器。

### 5. 验证
*   启动项目（开发模式）。
*   检查 `/swagger` 路径，确认各模块接口、参数、响应模型显示完整且正确。

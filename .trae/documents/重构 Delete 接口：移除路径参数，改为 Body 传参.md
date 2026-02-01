我将执行以下步骤，将所有 Delete 接口的传参方式从路径参数 (`@Param`) 改为请求体参数 (`@Body`)：

1.  **SysUser 模块**：
    *   修改 `sys-user.controller.ts`: 将 `@Delete(':userIds')` 改为 `@Delete()`，并将 `remove(@Param('userIds') userIds: string)` 改为 `remove(@Body() body: { userIds: string })`。
    *   **注意**: 这里的 `userIds` 字符串通常是逗号分隔的 ID。为了规范化，我建议在 DTO 中定义一个 `DeleteUserDto`，或者直接接受数组 `number[]`。但为了保持与现有 Service 逻辑（通常接受字符串或数组）的最小侵入性，我会先将其改为从 Body 接收。鉴于用户之前提到要匹配数据库字段，如果是批量删除，通常 Body 会传递 ID 列表。这里我会假设前端传递的是 `{ ids: number[] }` 或者保持原有的逗号分隔字符串 `{ ids: string }`。为了稳健性，我将统一改为接收 `{ ids: number[] }` 并在 Controller 层处理成 Service 需要的格式（如果是逗号分隔字符串）。
    *   *修正计划*: 考虑到 NestJS 标准和之前的 DTO 重构，我将为每个模块创建或复用一个 `DeleteDto`，或者直接在 Controller 中定义 Body 结构。为了快速且规范，我将在各模块 DTO 文件中添加如 `DeleteUserDto` (包含 `user_ids: number[]` 或 `ids: string`，根据 Service 逻辑调整)。**查看 Service 逻辑发现 `delete` 方法接收 `string` 并执行 `split(',')`。** 因此，最简单的改动是 Body 接收 `{ ids: string }` (逗号分隔) 或者 `{ ids: number[] }` 并转为字符串。
    *   **最终决定**: 将 Controller 改为 `@Delete()`，参数使用 `@Body()` 接收 `{ ids: string }`（对应原 URL 参数名，例如 `userIds` 改为 `ids` 可能更通用，但为了清晰，我会使用具体的 ID 列表字段名，如 `user_ids`，以符合 snake_case 规范）。
    *   **具体字段名**:
        *   User: `user_ids`
        *   Role: `role_ids`
        *   Menu: `menu_id` (单个删除)
        *   Dept: `dept_id` (单个删除)
        *   Post: `post_ids`
        *   Dict Type: `dict_ids`
        *   Dict Data: `dict_codes`
        *   Config: `config_ids`
        *   Notice: `notice_ids`
        *   OperLog: `oper_ids`
        *   LoginInfo: `info_ids`
        *   Online: `token_id`

2.  **执行修改**:
    *   逐个修改上述 Controller 文件。
    *   去掉 `@Delete` 装饰器中的路径参数。
    *   将 `@Param` 替换为 `@Body`。
    *   更新 Service 调用逻辑（如果 Service 需要的参数格式与 Body 不一致，进行简单转换，例如 `join(',')`）。**注意：之前的 Service 逻辑是 `userIds.split(',')`，说明 Service 期望的是逗号分隔的字符串。为了兼容性，Controller 层接收 Body 后，如果前端传数组，则 join；如果传字符串，则直接传。建议前端传数组 `{ ids: [1, 2, 3] }`，Controller 转为 "1,2,3" 传给 Service。**
    *   为了严格遵循用户之前的 "snake_case" 指令，Body 参数名将采用下划线格式。

3.  **更新 API_DOCS.md**:
    *   更新文档中所有 Delete 接口的说明。
    *   更新 URL（去掉路径参数）。
    *   添加 Body Parameters 说明。
    *   更新 cURL 示例。

**确认 Service 逻辑**:
之前的 `sys-user.service.ts` 中 `delete(userIds: string)` 确实是 `userIds.split(',')`。这意味着 Service 期望字符串。
我将在 Controller 中接收 `{ user_ids: number[] | string }`。为了规范，建议接收数组 `number[]`，并在 Controller 中 `join(',')` 后传给 Service。

**计划修改列表**:
1.  `src/routes/system/user/sys-user.controller.ts`
2.  `src/routes/system/role/sys-role.controller.ts`
3.  `src/routes/system/menu/sys-menu.controller.ts`
4.  `src/routes/system/dept/sys-dept.controller.ts`
5.  `src/routes/system/post/sys-post.controller.ts`
6.  `src/routes/system/dict/sys-dict.controller.ts`
7.  `src/routes/system/config/sys-config.controller.ts`
8.  `src/routes/system/notice/sys-notice.controller.ts`
9.  `src/routes/monitor/operlog/sys-oper-log.controller.ts`
10. `src/routes/monitor/logininfor/sys-logininfor.controller.ts`
11. `src/routes/monitor/online/sys-online.controller.ts`
12. `API_DOCS.md`

这将确保所有删除操作都通过 Body 传递参数，符合您的要求。
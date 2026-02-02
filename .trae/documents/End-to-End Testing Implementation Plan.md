# 补全系统模块 del\_flag 字段及逻辑

## 1. 数据库变更

* **表**: `sys_notice`

* **操作**: 添加 `del_flag` 字段，类型 `char(1)`，默认值 `'0'`，注释 `'删除标志（0代表存在 2代表删除）'`。

## 2. 代码模型更新

* **文件**: `src/databases/mysql-database/model/sys-notice.model.ts`

* **操作**: 添加 `del_flag` 属性定义，与数据库保持一致。

## 3. 业务逻辑清理 (移除 @ts-ignore)

由于之前部分模块在模型未定义 `del_flag` 时就使用了该字段，导致代码中存在大量 `// @ts-ignore` 注释。现在模型已补全，需要移除这些注释以恢复类型检查。

* `src/routes/system/dept/sys-dept.service.ts`

* `src/routes/system/notice/sys-notice.service.ts`

* `src/routes/system/post/sys-post.service.ts`

* `src/routes/system/role/sys-role.service.ts`

* `src/routes/system/user/sys-user.service.ts`

## 4. 验证

* 确认 `sys_notice` 表结构已更新。

* 确认相关 Service 文件无类型错误。


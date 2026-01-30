# RBAC 权限控制实施计划 (含数据初始化)

根据你的要求，我将在实施代码逻辑前，优先完成数据库数据的初始化操作。

## 1. 数据初始化 (优先执行)

**目标**：确保 `user_id=1` 的用户拥有 `SUPERADMIN` 角色。

**操作步骤**：
我们将编写并执行一个一次性脚本 (`src/scripts/init-super-admin.ts`)，执行以下逻辑：
1. **检查/创建角色**：查询 `sys_role` 表是否存在 `role_key = 'SUPERADMIN'` 的角色。
   * 如不存在，创建一个名为 "超级管理员"、标识为 `SUPERADMIN` 的新角色。
2. **赋予权限**：检查 `sys_user_role` 表，确保 `user_id=1` 的用户与 `SUPERADMIN` 角色已关联。
   * 如未关联，插入关联记录。

## 2. 权限控制系统实施

### 第一步：创建权限服务 (SysPermissionService)
* 位置：`src/routes/system/permission/sys-permission.service.ts`
* **逻辑**：
  * `getRolePermission(user)`: 获取用户角色列表。如果包含 `SUPERADMIN`，系统将识别为超级管理员。
  * `getMenuPermission(user)`: 
    * 若为超级管理员 (`SUPERADMIN`) -> 返回 `['*:*:*']`。
    * 否则 -> 返回实际菜单权限。

### 第二步：创建装饰器 & 守卫
1. **装饰器**：
   * `@Public()`: 免登录访问。
   * `@RequirePermissions()`: 需特定权限访问。
2. **守卫 (Guards)**：
   * **`AuthTokenGuard`** (升级): 支持 `@Public()` 跳过认证。
   * **`PermissionsGuard`** (新增): 
     * 跳过 `@Public()`。
     * **放行拥有 `SUPERADMIN` 角色的用户**。
     * 其他用户校验权限字符。

### 第三步：全局配置
* 在 `AppModule` 中注册全局守卫，确保安全策略覆盖所有接口（除 `@Public` 外）。
* 为 `AuthController` (登录) 添加 `@Public()`。

确认后，我将首先执行数据初始化，然后进行代码实现。

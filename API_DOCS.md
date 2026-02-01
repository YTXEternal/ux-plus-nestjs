# API 文档

本文档列出了系统中的所有 API 接口，并提供了 cURL 示例。所有接口的基础路径为 `/v1`。

## 认证模块 (Auth)

### 登录
**URL:** `/v1/auth/login`
**Method:** `POST`
**Description:** 用户登录接口。

**cURL 示例:**
```bash
curl -X POST "http://localhost:3000/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "admin",
    "password": "password123"
  }'
```

### 获取列表 (测试)
**URL:** `/v1/auth/list`
**Method:** `GET`
**Description:** 测试接口。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/auth/list"
```

---

## 系统管理模块 (System)

### 用户管理 (User)

#### 获取用户列表
**URL:** `/v1/system/user/list`
**Method:** `GET`
**Description:** 获取用户列表，支持分页和条件查询。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/system/user/list?pageNum=1&pageSize=10&user_name=admin" \
  -H "Authorization: Bearer <token>"
```

#### 获取用户详情
**URL:** `/v1/system/user/:userId`
**Method:** `GET`
**Description:** 根据用户 ID 获取用户详细信息。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/system/user/1" \
  -H "Authorization: Bearer <token>"
```

#### 创建用户
**URL:** `/v1/system/user`
**Method:** `POST`
**Description:** 创建新用户。

**cURL 示例:**
```bash
curl -X POST "http://localhost:3000/v1/system/user" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "testuser",
    "nick_name": "Test User",
    "password": "password123",
    "dept_id": 101,
    "role_ids": [1],
    "post_ids": [1],
    "status": "0"
  }'
```

#### 更新用户
**URL:** `/v1/system/user`
**Method:** `PUT`
**Description:** 更新用户信息。

**cURL 示例:**
```bash
curl -X PUT "http://localhost:3000/v1/system/user" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "user_name": "testuser",
    "nick_name": "Test User Updated",
    "dept_id": 101,
    "status": "0"
  }'
```

#### 删除用户
**URL:** `/v1/system/user`
**Method:** `DELETE`
**Description:** 删除用户（支持批量）。

**cURL 示例:**
```bash
curl -X DELETE "http://localhost:3000/v1/system/user" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_ids": [1, 2]
  }'
```

#### 重置密码
**URL:** `/v1/system/user/resetPwd`
**Method:** `PUT`
**Description:** 重置用户密码。

**cURL 示例:**
```bash
curl -X PUT "http://localhost:3000/v1/system/user/resetPwd" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "password": "newpassword123"
  }'
```

#### 修改用户状态
**URL:** `/v1/system/user/changeStatus`
**Method:** `PUT`
**Description:** 修改用户状态。

**cURL 示例:**
```bash
curl -X PUT "http://localhost:3000/v1/system/user/changeStatus" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "status": "1"
  }'
```

### 角色管理 (Role)

#### 获取角色列表
**URL:** `/v1/system/role/list`
**Method:** `GET`
**Description:** 获取角色列表。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/system/role/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer <token>"
```

#### 获取角色详情
**URL:** `/v1/system/role/:roleId`
**Method:** `GET`
**Description:** 根据角色 ID 获取角色详情。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/system/role/1" \
  -H "Authorization: Bearer <token>"
```

#### 创建角色
**URL:** `/v1/system/role`
**Method:** `POST`
**Description:** 创建新角色。

**cURL 示例:**
```bash
curl -X POST "http://localhost:3000/v1/system/role" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "role_name": "Test Role",
    "role_key": "test",
    "role_sort": 1,
    "status": "0",
    "menu_ids": [1, 2]
  }'
```

#### 更新角色
**URL:** `/v1/system/role`
**Method:** `PUT`
**Description:** 更新角色信息。

**cURL 示例:**
```bash
curl -X PUT "http://localhost:3000/v1/system/role" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "role_id": 1,
    "role_name": "Test Role Updated",
    "role_key": "test",
    "role_sort": 1,
    "status": "0"
  }'
```

#### 删除角色
**URL:** `/v1/system/role`
**Method:** `DELETE`
**Description:** 删除角色（支持批量）。

**cURL 示例:**
```bash
curl -X DELETE "http://localhost:3000/v1/system/role" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "role_ids": [1]
  }'
```

#### 修改角色状态
**URL:** `/v1/system/role/changeStatus`
**Method:** `PUT`
**Description:** 修改角色状态。

**cURL 示例:**
```bash
curl -X PUT "http://localhost:3000/v1/system/role/changeStatus" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "role_id": 1,
    "status": "1"
  }'
```

### 菜单管理 (Menu)

#### 获取菜单列表
**URL:** `/v1/system/menu/list`
**Method:** `GET`
**Description:** 获取菜单列表。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/system/menu/list" \
  -H "Authorization: Bearer <token>"
```

#### 获取菜单详情
**URL:** `/v1/system/menu/:menuId`
**Method:** `GET`
**Description:** 根据菜单 ID 获取菜单详情。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/system/menu/1" \
  -H "Authorization: Bearer <token>"
```

#### 创建菜单
**URL:** `/v1/system/menu`
**Method:** `POST`
**Description:** 创建新菜单。

**cURL 示例:**
```bash
curl -X POST "http://localhost:3000/v1/system/menu" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "menu_name": "Test Menu",
    "parent_id": 0,
    "order_num": 1,
    "path": "test",
    "menu_type": "C",
    "status": "0"
  }'
```

#### 更新菜单
**URL:** `/v1/system/menu`
**Method:** `PUT`
**Description:** 更新菜单信息。

**cURL 示例:**
```bash
curl -X PUT "http://localhost:3000/v1/system/menu" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "menu_id": 1,
    "menu_name": "Test Menu Updated",
    "menu_type": "C",
    "order_num": 1
  }'
```

#### 删除菜单
**URL:** `/v1/system/menu`
**Method:** `DELETE`
**Description:** 删除菜单。

**cURL 示例:**
```bash
curl -X DELETE "http://localhost:3000/v1/system/menu" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "menu_id": 1
  }'
```

#### 获取菜单下拉树列表
**URL:** `/v1/system/menu/treeselect`
**Method:** `GET`
**Description:** 获取菜单下拉树列表。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/system/menu/treeselect" \
  -H "Authorization: Bearer <token>"
```

### 部门管理 (Dept)

#### 获取部门列表
**URL:** `/v1/system/dept/list`
**Method:** `GET`
**Description:** 获取部门列表。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/system/dept/list" \
  -H "Authorization: Bearer <token>"
```

#### 获取部门详情
**URL:** `/v1/system/dept/:deptId`
**Method:** `GET`
**Description:** 根据部门 ID 获取部门详情。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/system/dept/1" \
  -H "Authorization: Bearer <token>"
```

#### 创建部门
**URL:** `/v1/system/dept`
**Method:** `POST`
**Description:** 创建新部门。

**cURL 示例:**
```bash
curl -X POST "http://localhost:3000/v1/system/dept" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "dept_name": "Test Dept",
    "parent_id": 0,
    "order_num": 1,
    "status": "0"
  }'
```

#### 更新部门
**URL:** `/v1/system/dept`
**Method:** `PUT`
**Description:** 更新部门信息。

**cURL 示例:**
```bash
curl -X PUT "http://localhost:3000/v1/system/dept" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "dept_id": 1,
    "dept_name": "Test Dept Updated",
    "order_num": 1
  }'
```

#### 删除部门
**URL:** `/v1/system/dept`
**Method:** `DELETE`
**Description:** 删除部门。

**cURL 示例:**
```bash
curl -X DELETE "http://localhost:3000/v1/system/dept" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "dept_id": 1
  }'
```

### 岗位管理 (Post)

#### 获取岗位列表
**URL:** `/v1/system/post/list`
**Method:** `GET`
**Description:** 获取岗位列表。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/system/post/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer <token>"
```

#### 获取岗位详情
**URL:** `/v1/system/post/:postId`
**Method:** `GET`
**Description:** 根据岗位 ID 获取岗位详情。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/system/post/1" \
  -H "Authorization: Bearer <token>"
```

#### 创建岗位
**URL:** `/v1/system/post`
**Method:** `POST`
**Description:** 创建新岗位。

**cURL 示例:**
```bash
curl -X POST "http://localhost:3000/v1/system/post" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "post_code": "test",
    "post_name": "Test Post",
    "post_sort": 1,
    "status": "0"
  }'
```

#### 更新岗位
**URL:** `/v1/system/post`
**Method:** `PUT`
**Description:** 更新岗位信息。

**cURL 示例:**
```bash
curl -X PUT "http://localhost:3000/v1/system/post" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "post_id": 1,
    "post_code": "test",
    "post_name": "Test Post Updated",
    "post_sort": 1,
    "status": "0"
  }'
```

#### 删除岗位
**URL:** `/v1/system/post`
**Method:** `DELETE`
**Description:** 删除岗位（支持批量）。

**cURL 示例:**
```bash
curl -X DELETE "http://localhost:3000/v1/system/post" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "post_ids": [1]
  }'
```

### 字典管理 (Dict)

#### 获取字典类型列表
**URL:** `/v1/system/dict/type/list`
**Method:** `GET`
**Description:** 获取字典类型列表。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/system/dict/type/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer <token>"
```

#### 获取字典类型详情
**URL:** `/v1/system/dict/type/:dictId`
**Method:** `GET`
**Description:** 根据字典 ID 获取字典类型详情。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/system/dict/type/1" \
  -H "Authorization: Bearer <token>"
```

#### 创建字典类型
**URL:** `/v1/system/dict/type`
**Method:** `POST`
**Description:** 创建新字典类型。

**cURL 示例:**
```bash
curl -X POST "http://localhost:3000/v1/system/dict/type" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "dict_name": "Test Dict",
    "dict_type": "sys_test",
    "status": "0"
  }'
```

#### 更新字典类型
**URL:** `/v1/system/dict/type`
**Method:** `PUT`
**Description:** 更新字典类型信息。

**cURL 示例:**
```bash
curl -X PUT "http://localhost:3000/v1/system/dict/type" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "dict_id": 1,
    "dict_name": "Test Dict Updated",
    "dict_type": "sys_test",
    "status": "0"
  }'
```

#### 删除字典类型
**URL:** `/v1/system/dict/type`
**Method:** `DELETE`
**Description:** 删除字典类型（支持批量）。

**cURL 示例:**
```bash
curl -X DELETE "http://localhost:3000/v1/system/dict/type" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "dict_ids": [1]
  }'
```

#### 获取字典数据列表
**URL:** `/v1/system/dict/data/list`
**Method:** `GET`
**Description:** 获取字典数据列表。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/system/dict/data/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer <token>"
```

#### 获取字典数据详情
**URL:** `/v1/system/dict/data/:dictCode`
**Method:** `GET`
**Description:** 根据字典编码获取字典数据详情。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/system/dict/data/1" \
  -H "Authorization: Bearer <token>"
```

#### 根据类型获取字典数据
**URL:** `/v1/system/dict/data/type/:dictType`
**Method:** `GET`
**Description:** 根据字典类型获取字典数据。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/system/dict/data/type/sys_user_sex" \
  -H "Authorization: Bearer <token>"
```

#### 创建字典数据
**URL:** `/v1/system/dict/data`
**Method:** `POST`
**Description:** 创建新字典数据。

**cURL 示例:**
```bash
curl -X POST "http://localhost:3000/v1/system/dict/data" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "dict_type": "sys_test",
    "dict_label": "Test Label",
    "dict_value": "1",
    "dict_sort": 1,
    "status": "0"
  }'
```

#### 更新字典数据
**URL:** `/v1/system/dict/data`
**Method:** `PUT`
**Description:** 更新字典数据。

**cURL 示例:**
```bash
curl -X PUT "http://localhost:3000/v1/system/dict/data" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "dict_code": 1,
    "dict_type": "sys_test",
    "dict_label": "Test Label Updated",
    "dict_value": "1",
    "dict_sort": 1,
    "status": "0"
  }'
```

#### 删除字典数据
**URL:** `/v1/system/dict/data`
**Method:** `DELETE`
**Description:** 删除字典数据（支持批量）。

**cURL 示例:**
```bash
curl -X DELETE "http://localhost:3000/v1/system/dict/data" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "dict_codes": [1]
  }'
```

### 参数配置管理 (Config)

#### 获取参数列表
**URL:** `/v1/system/config/list`
**Method:** `GET`
**Description:** 获取参数配置列表。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/system/config/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer <token>"
```

#### 获取参数详情
**URL:** `/v1/system/config/:configId`
**Method:** `GET`
**Description:** 根据参数 ID 获取参数详情。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/system/config/1" \
  -H "Authorization: Bearer <token>"
```

#### 根据键名获取参数
**URL:** `/v1/system/config/configKey/:configKey`
**Method:** `GET`
**Description:** 根据参数键名获取参数详情。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/system/config/configKey/sys.user.initPassword" \
  -H "Authorization: Bearer <token>"
```

#### 创建参数
**URL:** `/v1/system/config`
**Method:** `POST`
**Description:** 创建新参数配置。

**cURL 示例:**
```bash
curl -X POST "http://localhost:3000/v1/system/config" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "config_name": "Test Config",
    "config_key": "test.config",
    "config_value": "true",
    "config_type": "Y"
  }'
```

#### 更新参数
**URL:** `/v1/system/config`
**Method:** `PUT`
**Description:** 更新参数配置。

**cURL 示例:**
```bash
curl -X PUT "http://localhost:3000/v1/system/config" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "config_id": 1,
    "config_name": "Test Config Updated",
    "config_key": "test.config",
    "config_value": "false"
  }'
```

#### 删除参数
**URL:** `/v1/system/config`
**Method:** `DELETE`
**Description:** 删除参数配置（支持批量）。

**cURL 示例:**
```bash
curl -X DELETE "http://localhost:3000/v1/system/config" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "config_ids": [1]
  }'
```

### 通知公告管理 (Notice)

#### 获取通知列表
**URL:** `/v1/system/notice/list`
**Method:** `GET`
**Description:** 获取通知公告列表。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/system/notice/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer <token>"
```

#### 获取通知详情
**URL:** `/v1/system/notice/:noticeId`
**Method:** `GET`
**Description:** 根据通知 ID 获取通知详情。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/system/notice/1" \
  -H "Authorization: Bearer <token>"
```

#### 创建通知
**URL:** `/v1/system/notice`
**Method:** `POST`
**Description:** 创建新通知公告。

**cURL 示例:**
```bash
curl -X POST "http://localhost:3000/v1/system/notice" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "notice_title": "Test Notice",
    "notice_type": "1",
    "notice_content": "Content",
    "status": "0"
  }'
```

#### 更新通知
**URL:** `/v1/system/notice`
**Method:** `PUT`
**Description:** 更新通知公告。

**cURL 示例:**
```bash
curl -X PUT "http://localhost:3000/v1/system/notice" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "notice_id": 1,
    "notice_title": "Test Notice Updated",
    "notice_type": "1",
    "notice_content": "Content Updated"
  }'
```

#### 删除通知
**URL:** `/v1/system/notice`
**Method:** `DELETE`
**Description:** 删除通知公告（支持批量）。

**cURL 示例:**
```bash
curl -X DELETE "http://localhost:3000/v1/system/notice" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "notice_ids": [1]
  }'
```

---

## 监控模块 (Monitor)

### 登录日志 (Logininfor)

#### 获取登录日志列表
**URL:** `/v1/monitor/logininfor/list`
**Method:** `GET`
**Description:** 获取登录日志列表。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/monitor/logininfor/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer <token>"
```

#### 删除登录日志
**URL:** `/v1/monitor/logininfor`
**Method:** `DELETE`
**Description:** 删除登录日志（支持批量）。

**cURL 示例:**
```bash
curl -X DELETE "http://localhost:3000/v1/monitor/logininfor" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "info_ids": [1]
  }'
```

#### 清空登录日志
**URL:** `/v1/monitor/logininfor/clean`
**Method:** `DELETE`
**Description:** 清空所有登录日志。

**cURL 示例:**
```bash
curl -X DELETE "http://localhost:3000/v1/monitor/logininfor/clean" \
  -H "Authorization: Bearer <token>"
```

#### 解锁用户
**URL:** `/v1/monitor/logininfor/unlock/:user_name`
**Method:** `GET`
**Description:** 解锁用户登录。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/monitor/logininfor/unlock/admin" \
  -H "Authorization: Bearer <token>"
```

### 在线用户 (Online)

#### 获取在线用户列表
**URL:** `/v1/monitor/online/list`
**Method:** `GET`
**Description:** 获取在线用户列表。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/monitor/online/list" \
  -H "Authorization: Bearer <token>"
```

#### 强退用户
**URL:** `/v1/monitor/online`
**Method:** `DELETE`
**Description:** 强制退出用户。

**cURL 示例:**
```bash
curl -X DELETE "http://localhost:3000/v1/monitor/online" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "token_id": "uuid-token-id"
  }'
```

### 操作日志 (OperLog)

#### 获取操作日志列表
**URL:** `/v1/monitor/operlog/list`
**Method:** `GET`
**Description:** 获取操作日志列表。

**cURL 示例:**
```bash
curl -X GET "http://localhost:3000/v1/monitor/operlog/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer <token>"
```

#### 删除操作日志
**URL:** `/v1/monitor/operlog`
**Method:** `DELETE`
**Description:** 删除操作日志（支持批量）。

**cURL 示例:**
```bash
curl -X DELETE "http://localhost:3000/v1/monitor/operlog" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "oper_ids": [1]
  }'
```

#### 清空操作日志
**URL:** `/v1/monitor/operlog/clean`
**Method:** `DELETE`
**Description:** 清空所有操作日志。

**cURL 示例:**
```bash
curl -X DELETE "http://localhost:3000/v1/monitor/operlog/clean" \
  -H "Authorization: Bearer <token>"
```

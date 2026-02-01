# API 接口文档

本文档列出了系统所有的 API 接口，可用于 Apifox 测试。

**基础 URL**: `http://localhost:3000/api/v1` (假设默认端口)

**通用响应结构**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": { ... }
}
```

---

## 1. 认证模块 (Auth)

### 1.1 用户登录
*   **接口名称**: 登录
*   **URL**: `/api/v1/auth/login`
*   **Method**: `POST`
*   **请求参数 (Body - JSON)**:
    ```json
    {
      "account": "admin",
      "password": "encrypted_password_string" // 前端需RSA加密
    }
    ```
*   **cURL 示例**:
    ```bash
    curl -X POST http://localhost:3000/api/v1/auth/login \
      -H "Content-Type: application/json" \
      -d '{
        "account": "admin",
        "password": "your_encrypted_password_here"
      }'
    ```
*   **成功响应**:
    ```json
    {
      "code": 200,
      "message": "Login successful",
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR..."
      }
    }
    ```
*   **失败响应**:
    ```json
    {
      "code": 400,
      "message": "Incorrect password",
      "data": null
    }
    ```

### 1.2 测试 Token 验证
*   **接口名称**: Token 测试
*   **URL**: `/api/v1/auth/list`
*   **Method**: `GET`
*   **Headers**:
    *   `Authorization`: `Bearer <your_token>`
*   **cURL 示例**:
    ```bash
    curl -X GET http://localhost:3000/api/v1/auth/list \
      -H "Authorization: Bearer <your_token>"
    ```
*   **成功响应**:
    ```json
    {
      "code": 200,
      "message": "success",
      "data": []
    }
    ```

---

## 2. 系统管理 (System)

### 2.1 用户管理 (User)

#### 获取用户列表
*   **URL**: `/api/v1/system/user/list`
*   **Method**: `GET`
*   **Query**: `pageNum`, `pageSize`, `userName`, `phonenumber`, `status`, `deptId`
*   **cURL 示例**:
    ```bash
    curl -X GET "http://localhost:3000/api/v1/system/user/list?pageNum=1&pageSize=10" \
      -H "Authorization: Bearer <your_token>"
    ```

#### 获取用户详情
*   **URL**: `/api/v1/system/user/:userId`
*   **Method**: `GET`
*   **Params**: `userId`
*   **cURL 示例**:
    ```bash
    curl -X GET http://localhost:3000/api/v1/system/user/1 \
      -H "Authorization: Bearer <your_token>"
    ```

#### 新增用户
*   **URL**: `/api/v1/system/user`
*   **Method**: `POST`
*   **cURL 示例**:
    ```bash
    curl -X POST http://localhost:3000/api/v1/system/user \
      -H "Authorization: Bearer <your_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "nick_name": "Test User",
        "user_name": "test",
        "password": "password123",
        "dept_id": 103,
        "status": "0"
      }'
    ```

#### 修改用户
*   **URL**: `/api/v1/system/user`
*   **Method**: `PUT`
*   **cURL 示例**:
    ```bash
    curl -X PUT http://localhost:3000/api/v1/system/user \
      -H "Authorization: Bearer <your_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "user_id": 100,
        "nick_name": "Updated Name"
      }'
    ```

#### 删除用户
*   **URL**: `/api/v1/system/user/:userIds`
*   **Method**: `DELETE`
*   **cURL 示例**:
    ```bash
    curl -X DELETE http://localhost:3000/api/v1/system/user/100,101 \
      -H "Authorization: Bearer <your_token>"
    ```

#### 重置密码
*   **URL**: `/api/v1/system/user/resetPwd`
*   **Method**: `PUT`
*   **cURL 示例**:
    ```bash
    curl -X PUT http://localhost:3000/api/v1/system/user/resetPwd \
      -H "Authorization: Bearer <your_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "user_id": 100,
        "password": "newPassword123"
      }'
    ```

#### 修改状态
*   **URL**: `/api/v1/system/user/changeStatus`
*   **Method**: `PUT`
*   **cURL 示例**:
    ```bash
    curl -X PUT http://localhost:3000/api/v1/system/user/changeStatus \
      -H "Authorization: Bearer <your_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "user_id": 100,
        "status": "1"
      }'
    ```

---

### 2.2 角色管理 (Role)

#### 获取角色列表
*   **URL**: `/api/v1/system/role/list`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET "http://localhost:3000/api/v1/system/role/list?pageNum=1&pageSize=10" \
      -H "Authorization: Bearer <your_token>"
    ```

#### 获取角色详情
*   **URL**: `/api/v1/system/role/:roleId`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET http://localhost:3000/api/v1/system/role/1 \
      -H "Authorization: Bearer <your_token>"
    ```

#### 新增角色
*   **URL**: `/api/v1/system/role`
*   **Method**: `POST`
*   **cURL 示例**:
    ```bash
    curl -X POST http://localhost:3000/api/v1/system/role \
      -H "Authorization: Bearer <your_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "role_name": "Test Role",
        "role_key": "test",
        "role_sort": 1,
        "status": "0"
      }'
    ```

#### 修改角色
*   **URL**: `/api/v1/system/role`
*   **Method**: `PUT`
*   **cURL 示例**:
    ```bash
    curl -X PUT http://localhost:3000/api/v1/system/role \
      -H "Authorization: Bearer <your_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "role_id": 100,
        "role_name": "Updated Role"
      }'
    ```

#### 删除角色
*   **URL**: `/api/v1/system/role/:roleIds`
*   **Method**: `DELETE`
*   **cURL 示例**:
    ```bash
    curl -X DELETE http://localhost:3000/api/v1/system/role/100 \
      -H "Authorization: Bearer <your_token>"
    ```

#### 修改状态
*   **URL**: `/api/v1/system/role/changeStatus`
*   **Method**: `PUT`
*   **cURL 示例**:
    ```bash
    curl -X PUT http://localhost:3000/api/v1/system/role/changeStatus \
      -H "Authorization: Bearer <your_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "role_id": 100,
        "status": "1"
      }'
    ```

---

### 2.3 菜单管理 (Menu)

#### 获取菜单列表
*   **URL**: `/api/v1/system/menu/list`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET http://localhost:3000/api/v1/system/menu/list \
      -H "Authorization: Bearer <your_token>"
    ```

#### 获取菜单详情
*   **URL**: `/api/v1/system/menu/:menuId`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET http://localhost:3000/api/v1/system/menu/1 \
      -H "Authorization: Bearer <your_token>"
    ```

#### 新增菜单
*   **URL**: `/api/v1/system/menu`
*   **Method**: `POST`
*   **cURL 示例**:
    ```bash
    curl -X POST http://localhost:3000/api/v1/system/menu \
      -H "Authorization: Bearer <your_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "menu_name": "Test Menu",
        "menu_type": "C",
        "path": "test",
        "order_num": 1
      }'
    ```

#### 修改菜单
*   **URL**: `/api/v1/system/menu`
*   **Method**: `PUT`
*   **cURL 示例**:
    ```bash
    curl -X PUT http://localhost:3000/api/v1/system/menu \
      -H "Authorization: Bearer <your_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "menu_id": 100,
        "menu_name": "Updated Menu"
      }'
    ```

#### 删除菜单
*   **URL**: `/api/v1/system/menu/:menuId`
*   **Method**: `DELETE`
*   **cURL 示例**:
    ```bash
    curl -X DELETE http://localhost:3000/api/v1/system/menu/100 \
      -H "Authorization: Bearer <your_token>"
    ```

#### 获取菜单树下拉
*   **URL**: `/api/v1/system/menu/treeselect`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET http://localhost:3000/api/v1/system/menu/treeselect \
      -H "Authorization: Bearer <your_token>"
    ```

---

### 2.4 部门管理 (Dept)

#### 获取部门列表
*   **URL**: `/api/v1/system/dept/list`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET http://localhost:3000/api/v1/system/dept/list \
      -H "Authorization: Bearer <your_token>"
    ```

#### 获取部门详情
*   **URL**: `/api/v1/system/dept/:deptId`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET http://localhost:3000/api/v1/system/dept/100 \
      -H "Authorization: Bearer <your_token>"
    ```

#### 新增部门
*   **URL**: `/api/v1/system/dept`
*   **Method**: `POST`
*   **cURL 示例**:
    ```bash
    curl -X POST http://localhost:3000/api/v1/system/dept \
      -H "Authorization: Bearer <your_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "parent_id": 100,
        "dept_name": "Test Dept",
        "order_num": 1
      }'
    ```

#### 修改部门
*   **URL**: `/api/v1/system/dept`
*   **Method**: `PUT`
*   **cURL 示例**:
    ```bash
    curl -X PUT http://localhost:3000/api/v1/system/dept \
      -H "Authorization: Bearer <your_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "dept_id": 100,
        "dept_name": "Updated Dept"
      }'
    ```

#### 删除部门
*   **URL**: `/api/v1/system/dept/:deptId`
*   **Method**: `DELETE`
*   **cURL 示例**:
    ```bash
    curl -X DELETE http://localhost:3000/api/v1/system/dept/100 \
      -H "Authorization: Bearer <your_token>"
    ```

---

### 2.5 岗位管理 (Post)

#### 获取岗位列表
*   **URL**: `/api/v1/system/post/list`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET "http://localhost:3000/api/v1/system/post/list?pageNum=1&pageSize=10" \
      -H "Authorization: Bearer <your_token>"
    ```

#### 获取岗位详情
*   **URL**: `/api/v1/system/post/:postId`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET http://localhost:3000/api/v1/system/post/1 \
      -H "Authorization: Bearer <your_token>"
    ```

#### 新增岗位
*   **URL**: `/api/v1/system/post`
*   **Method**: `POST`
*   **cURL 示例**:
    ```bash
    curl -X POST http://localhost:3000/api/v1/system/post \
      -H "Authorization: Bearer <your_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "post_code": "test",
        "post_name": "Test Post",
        "post_sort": 1,
        "status": "0"
      }'
    ```

#### 修改岗位
*   **URL**: `/api/v1/system/post`
*   **Method**: `PUT`
*   **cURL 示例**:
    ```bash
    curl -X PUT http://localhost:3000/api/v1/system/post \
      -H "Authorization: Bearer <your_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "post_id": 1,
        "post_name": "Updated Post"
      }'
    ```

#### 删除岗位
*   **URL**: `/api/v1/system/post/:postIds`
*   **Method**: `DELETE`
*   **cURL 示例**:
    ```bash
    curl -X DELETE http://localhost:3000/api/v1/system/post/1 \
      -H "Authorization: Bearer <your_token>"
    ```

---

### 2.6 字典管理 (Dict)

#### 字典类型 - 列表
*   **URL**: `/api/v1/system/dict/type/list`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET "http://localhost:3000/api/v1/system/dict/type/list?pageNum=1&pageSize=10" \
      -H "Authorization: Bearer <your_token>"
    ```

#### 字典类型 - 详情
*   **URL**: `/api/v1/system/dict/type/:dictId`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET http://localhost:3000/api/v1/system/dict/type/1 \
      -H "Authorization: Bearer <your_token>"
    ```

#### 字典类型 - 新增
*   **URL**: `/api/v1/system/dict/type`
*   **Method**: `POST`
*   **cURL 示例**:
    ```bash
    curl -X POST http://localhost:3000/api/v1/system/dict/type \
      -H "Authorization: Bearer <your_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "dict_name": "Test Dict",
        "dict_type": "sys_test",
        "status": "0"
      }'
    ```

#### 字典类型 - 修改
*   **URL**: `/api/v1/system/dict/type`
*   **Method**: `PUT`
*   **cURL 示例**:
    ```bash
    curl -X PUT http://localhost:3000/api/v1/system/dict/type \
      -H "Authorization: Bearer <your_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "dict_id": 100,
        "dict_name": "Updated Dict"
      }'
    ```

#### 字典类型 - 删除
*   **URL**: `/api/v1/system/dict/type/:dictIds`
*   **Method**: `DELETE`
*   **cURL 示例**:
    ```bash
    curl -X DELETE http://localhost:3000/api/v1/system/dict/type/100 \
      -H "Authorization: Bearer <your_token>"
    ```

#### 字典数据 - 列表
*   **URL**: `/api/v1/system/dict/data/list`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET "http://localhost:3000/api/v1/system/dict/data/list?pageNum=1&pageSize=10" \
      -H "Authorization: Bearer <your_token>"
    ```

#### 字典数据 - 根据类型查询
*   **URL**: `/api/v1/system/dict/data/type/:dictType`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET http://localhost:3000/api/v1/system/dict/data/type/sys_user_sex \
      -H "Authorization: Bearer <your_token>"
    ```

#### 字典数据 - 详情
*   **URL**: `/api/v1/system/dict/data/:dictCode`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET http://localhost:3000/api/v1/system/dict/data/100 \
      -H "Authorization: Bearer <your_token>"
    ```

#### 字典数据 - 新增
*   **URL**: `/api/v1/system/dict/data`
*   **Method**: `POST`
*   **cURL 示例**:
    ```bash
    curl -X POST http://localhost:3000/api/v1/system/dict/data \
      -H "Authorization: Bearer <your_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "dict_type": "sys_test",
        "dict_label": "Item 1",
        "dict_value": "1",
        "dict_sort": 1
      }'
    ```

#### 字典数据 - 修改
*   **URL**: `/api/v1/system/dict/data`
*   **Method**: `PUT`
*   **cURL 示例**:
    ```bash
    curl -X PUT http://localhost:3000/api/v1/system/dict/data \
      -H "Authorization: Bearer <your_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "dict_code": 100,
        "dict_label": "Updated Label"
      }'
    ```

#### 字典数据 - 删除
*   **URL**: `/api/v1/system/dict/data/:dictCodes`
*   **Method**: `DELETE`
*   **cURL 示例**:
    ```bash
    curl -X DELETE http://localhost:3000/api/v1/system/dict/data/100 \
      -H "Authorization: Bearer <your_token>"
    ```

---

### 2.7 参数设置 (Config)

#### 获取参数列表
*   **URL**: `/api/v1/system/config/list`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET "http://localhost:3000/api/v1/system/config/list?pageNum=1&pageSize=10" \
      -H "Authorization: Bearer <your_token>"
    ```

#### 获取参数详情
*   **URL**: `/api/v1/system/config/:configId`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET http://localhost:3000/api/v1/system/config/1 \
      -H "Authorization: Bearer <your_token>"
    ```

#### 根据 Key 获取参数
*   **URL**: `/api/v1/system/config/configKey/:configKey`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET http://localhost:3000/api/v1/system/config/configKey/sys.user.initPassword \
      -H "Authorization: Bearer <your_token>"
    ```

#### 新增参数
*   **URL**: `/api/v1/system/config`
*   **Method**: `POST`
*   **cURL 示例**:
    ```bash
    curl -X POST http://localhost:3000/api/v1/system/config \
      -H "Authorization: Bearer <your_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "config_name": "Test Config",
        "config_key": "sys.test.config",
        "config_value": "true"
      }'
    ```

#### 修改参数
*   **URL**: `/api/v1/system/config`
*   **Method**: `PUT`
*   **cURL 示例**:
    ```bash
    curl -X PUT http://localhost:3000/api/v1/system/config \
      -H "Authorization: Bearer <your_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "config_id": 1,
        "config_value": "false"
      }'
    ```

#### 删除参数
*   **URL**: `/api/v1/system/config/:configIds`
*   **Method**: `DELETE`
*   **cURL 示例**:
    ```bash
    curl -X DELETE http://localhost:3000/api/v1/system/config/1 \
      -H "Authorization: Bearer <your_token>"
    ```

---

### 2.8 通知公告 (Notice)

#### 获取公告列表
*   **URL**: `/api/v1/system/notice/list`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET "http://localhost:3000/api/v1/system/notice/list?pageNum=1&pageSize=10" \
      -H "Authorization: Bearer <your_token>"
    ```

#### 获取公告详情
*   **URL**: `/api/v1/system/notice/:noticeId`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET http://localhost:3000/api/v1/system/notice/1 \
      -H "Authorization: Bearer <your_token>"
    ```

#### 新增公告
*   **URL**: `/api/v1/system/notice`
*   **Method**: `POST`
*   **cURL 示例**:
    ```bash
    curl -X POST http://localhost:3000/api/v1/system/notice \
      -H "Authorization: Bearer <your_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "notice_title": "System Update",
        "notice_type": "1",
        "notice_content": "Content...",
        "status": "0"
      }'
    ```

#### 修改公告
*   **URL**: `/api/v1/system/notice`
*   **Method**: `PUT`
*   **cURL 示例**:
    ```bash
    curl -X PUT http://localhost:3000/api/v1/system/notice \
      -H "Authorization: Bearer <your_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "notice_id": 1,
        "notice_title": "Updated Title"
      }'
    ```

#### 删除公告
*   **URL**: `/api/v1/system/notice/:noticeIds`
*   **Method**: `DELETE`
*   **cURL 示例**:
    ```bash
    curl -X DELETE http://localhost:3000/api/v1/system/notice/1 \
      -H "Authorization: Bearer <your_token>"
    ```

---

## 3. 系统监控 (Monitor)

### 3.1 操作日志 (OperLog)

#### 获取操作日志列表
*   **URL**: `/api/v1/monitor/operlog/list`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET "http://localhost:3000/api/v1/monitor/operlog/list?pageNum=1&pageSize=10" \
      -H "Authorization: Bearer <your_token>"
    ```

#### 删除操作日志
*   **URL**: `/api/v1/monitor/operlog/:operIds`
*   **Method**: `DELETE`
*   **cURL 示例**:
    ```bash
    curl -X DELETE http://localhost:3000/api/v1/monitor/operlog/1 \
      -H "Authorization: Bearer <your_token>"
    ```

#### 清空操作日志
*   **URL**: `/api/v1/monitor/operlog/clean`
*   **Method**: `DELETE`
*   **cURL 示例**:
    ```bash
    curl -X DELETE http://localhost:3000/api/v1/monitor/operlog/clean \
      -H "Authorization: Bearer <your_token>"
    ```

---

### 3.2 登录日志 (LoginInfor)

#### 获取登录日志列表
*   **URL**: `/api/v1/monitor/logininfor/list`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET "http://localhost:3000/api/v1/monitor/logininfor/list?pageNum=1&pageSize=10" \
      -H "Authorization: Bearer <your_token>"
    ```

#### 删除登录日志
*   **URL**: `/api/v1/monitor/logininfor/:infoIds`
*   **Method**: `DELETE`
*   **cURL 示例**:
    ```bash
    curl -X DELETE http://localhost:3000/api/v1/monitor/logininfor/1 \
      -H "Authorization: Bearer <your_token>"
    ```

#### 清空登录日志
*   **URL**: `/api/v1/monitor/logininfor/clean`
*   **Method**: `DELETE`
*   **cURL 示例**:
    ```bash
    curl -X DELETE http://localhost:3000/api/v1/monitor/logininfor/clean \
      -H "Authorization: Bearer <your_token>"
    ```

#### 账户解锁
*   **URL**: `/api/v1/monitor/logininfor/unlock/:userName`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET http://localhost:3000/api/v1/monitor/logininfor/unlock/admin \
      -H "Authorization: Bearer <your_token>"
    ```

---

### 3.3 在线用户 (Online)

#### 获取在线用户列表
*   **URL**: `/api/v1/monitor/online/list`
*   **Method**: `GET`
*   **cURL 示例**:
    ```bash
    curl -X GET http://localhost:3000/api/v1/monitor/online/list \
      -H "Authorization: Bearer <your_token>"
    ```

#### 强退用户
*   **URL**: `/api/v1/monitor/online/:tokenId`
*   **Method**: `DELETE`
*   **cURL 示例**:
    ```bash
    curl -X DELETE http://localhost:3000/api/v1/monitor/online/some_token_id \
      -H "Authorization: Bearer <your_token>"
    ```


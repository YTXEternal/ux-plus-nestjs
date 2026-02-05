# API 文档

> **基础 URL**: `/api/v1`
> **全局请求头**: 
> - `Content-Type: application/json`
> - `Authorization: Bearer <token>` (登录后接口需要)

## 通用响应结构

所有接口返回的数据都遵循以下结构（`ApiResponse<T>`）：

```typescript
interface ApiResponse<T> {
  code: number;    // 状态码，200 表示成功
  message: string; // 响应消息
  data?: T;        // 响应数据
}
```

---

## 1. 认证管理 (Auth)

### 1.1 获取公钥
- **Path**: `/auth/public-key`
- **Method**: `GET`
- **请求头**: 无需 Token
- **请求参数**: 无
- **响应类型**:
```typescript
interface PublicKeyResult {
  publicKey: string;
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "Get public key successful",
  "data": {
    "publicKey": "-----BEGIN PUBLIC KEY-----\n..."
  }
}
```

### 1.2 用户登录
- **Path**: `/auth/login`
- **Method**: `POST`
- **请求头**: 无需 Token
- **请求参数**:
```typescript
interface AuthLoginDto {
  user_name: string; // 用户名 (必填)
  password: string;  // 密码 (必填)
}
```
- **响应类型**:
```typescript
interface LoginResponseDto {
  token: string;        // 访问令牌
  refreshToken: string; // 刷新令牌
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR..."
  }
}
```

### 1.3 刷新令牌
- **Path**: `/auth/refresh`
- **Method**: `POST`
- **请求头**: 无需 Token
- **请求参数**:
```typescript
interface RefreshTokenDto {
  refreshToken: string; // 刷新令牌 (必填)
}
```
- **响应类型**:
```typescript
interface LoginResponseDto {
  token: string;
  refreshToken: string;
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "Refresh token successful",
  "data": {
    "token": "new_access_token..."
  }
}
```

### 1.4 获取用户信息
- **Path**: `/auth/info`
- **Method**: `GET`
- **请求参数**: 无
- **响应类型**:
```typescript
interface UserInfoResponseDto {
  user: UserResponseDto; // 用户详情
  roles: string[];       // 角色标识列表
  permissions: string[]; // 权限标识列表
}

interface UserResponseDto {
  user_id: number;
  dept_id: number;
  user_name: string;
  nick_name: string;
  email: string;
  phonenumber: string;
  sex: string;
  avatar: string;
  status: string;
  login_ip: string;
  login_date: Date;
  create_time: Date;
  remark?: string;
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "Get user info successful",
  "data": {
    "user": {
      "user_id": 1,
      "user_name": "admin",
      "nick_name": "管理员",
      ...
    },
    "roles": ["admin"],
    "permissions": ["*:*:*"]
  }
}
```

### 1.5 获取路由信息
- **Path**: `/auth/routers`
- **Method**: `GET`
- **请求参数**: 无
- **响应类型**: `RouterResponseDto[]`
```typescript
interface RouterResponseDto {
  menu_id: number;
  menu_name: string;
  parent_id: number;
  order_num: number;
  path: string;
  component: string;
  query: string;
  is_frame: number;
  is_cache: number;
  menu_type: string;
  visible: string;
  status: string;
  perms: string;
  icon: string;
  children?: RouterResponseDto[];
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "Get routers successful",
  "data": [
    {
      "menu_id": 1,
      "menu_name": "系统管理",
      "path": "system",
      "children": [...]
    }
  ]
}
```

---

## 2. 系统管理 - 用户管理 (User)

### 2.1 获取用户列表
- **Path**: `/system/user/list`
- **Method**: `GET`
- **请求参数** (Query):
```typescript
interface ListUserDto {
  pageNum?: number;    // 页码
  pageSize?: number;   // 每页数量
  user_name?: string;  // 用户名
  phonenumber?: string;// 手机号码
  status?: string;     // 状态
  dept_id?: number;    // 部门ID
}
```
- **响应类型**: `any` (通常包含 rows 和 total)
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "rows": [
      { "user_id": 1, "user_name": "admin", ... }
    ],
    "total": 10
  }
}
```

### 2.2 获取用户详情
- **Path**: `/system/user/:userId`
- **Method**: `GET`
- **请求参数** (Path):
  - `userId`: number
- **响应类型**: `any` (包含 user, roles, posts 等)
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "user": { "user_id": 1, ... },
    "roleIds": [1],
    "postIds": [1],
    "roles": [...],
    "posts": [...]
  }
}
```

### 2.3 新增用户
- **Path**: `/system/user`
- **Method**: `POST`
- **请求参数**:
```typescript
interface CreateUserDto {
  user_name: string;     // 用户名 (必填)
  nick_name: string;     // 昵称 (必填)
  password?: string;     // 密码
  dept_id?: number;      // 部门ID
  phonenumber?: string;  // 手机号
  email?: string;        // 邮箱
  sex?: string;          // 性别
  status?: string;       // 状态
  remark?: string;       // 备注
  post_ids?: number[];   // 岗位ID列表
  role_ids?: number[];   // 角色ID列表
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "操作成功"
}
```

### 2.4 修改用户
- **Path**: `/system/user`
- **Method**: `PUT`
- **请求参数**:
```typescript
interface UpdateUserDto extends CreateUserDto {
  user_id: number; // 用户ID (必填)
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "操作成功"
}
```

### 2.5 删除用户
- **Path**: `/system/user`
- **Method**: `DELETE`
- **请求参数** (Body):
```typescript
interface DeleteUserDto {
  user_ids: number[]; // 用户ID列表 (必填)
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "操作成功"
}
```

### 2.6 重置密码
- **Path**: `/system/user/resetPwd`
- **Method**: `PUT`
- **请求参数**:
```typescript
interface ResetPwdDto {
  user_id: number;  // 用户ID (必填)
  password: string; // 新密码 (必填)
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "操作成功"
}
```

### 2.7 修改状态
- **Path**: `/system/user/changeStatus`
- **Method**: `PUT`
- **请求参数**:
```typescript
interface ChangeStatusDto {
  user_id: number; // 用户ID (必填)
  status: string;  // 状态 (必填)
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "操作成功"
}
```

---

## 3. 系统管理 - 角色管理 (Role)

### 3.1 获取角色列表
- **Path**: `/system/role/list`
- **Method**: `GET`
- **请求参数** (Query):
```typescript
interface ListRoleDto {
  pageNum?: number;
  pageSize?: number;
  role_name?: string;
  role_key?: string;
  status?: string;
}
```
- **响应类型**: `any`
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "rows": [{ "role_id": 1, "role_name": "管理员", ... }],
    "total": 5
  }
}
```

### 3.2 获取角色详情
- **Path**: `/system/role/:roleId`
- **Method**: `GET`
- **请求参数** (Path): `roleId`
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": { "role_id": 1, "role_name": "管理员", ... }
}
```

### 3.3 新增角色
- **Path**: `/system/role`
- **Method**: `POST`
- **请求参数**:
```typescript
interface CreateRoleDto {
  role_name: string;     // 角色名称
  role_key: string;      // 权限字符
  role_sort: number;     // 显示顺序
  status: string;        // 状态
  remark?: string;       // 备注
  menu_ids?: number[];   // 菜单ID列表
  menu_check_strictly?: boolean;
  dept_check_strictly?: boolean;
}
```
- **响应示例**:
```json
{ "code": 200, "message": "操作成功" }
```

### 3.4 修改角色
- **Path**: `/system/role`
- **Method**: `PUT`
- **请求参数**:
```typescript
interface UpdateRoleDto extends CreateRoleDto {
  role_id: number; // 角色ID
}
```
- **响应示例**:
```json
{ "code": 200, "message": "操作成功" }
```

### 3.5 删除角色
- **Path**: `/system/role`
- **Method**: `DELETE`
- **请求参数** (Body):
```typescript
interface DeleteRoleDto {
  role_ids: number[]; // 角色ID列表
}
```
- **响应示例**:
```json
{ "code": 200, "message": "操作成功" }
```

---

## 4. 系统管理 - 菜单管理 (Menu)

### 4.1 获取菜单列表
- **Path**: `/system/menu/list`
- **Method**: `GET`
- **请求参数** (Query):
```typescript
interface ListMenuDto {
  menu_name?: string;
  status?: string;
}
```
- **响应类型**: `Menu[]`
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    { "menu_id": 1, "menu_name": "系统管理", "parent_id": 0, ... }
  ]
}
```

### 4.2 获取菜单详情
- **Path**: `/system/menu/:menuId`
- **Method**: `GET`
- **请求参数** (Path): `menuId`
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": { "menu_id": 1, ... }
}
```

### 4.3 新增菜单
- **Path**: `/system/menu`
- **Method**: `POST`
- **请求参数**:
```typescript
interface CreateMenuDto {
  parent_id?: number;    // 父菜单ID
  menu_name: string;     // 菜单名称
  order_num: number;     // 显示顺序
  path?: string;         // 路由地址
  component?: string;    // 组件路径
  is_frame?: number;     // 是否外链
  is_cache?: number;     // 是否缓存
  menu_type: string;     // 菜单类型 (M/C/F)
  visible?: string;      // 显示状态
  status?: string;       // 菜单状态
  perms?: string;        // 权限标识
  icon?: string;         // 图标
  query?: string;        // 路由参数
}
```
- **响应示例**:
```json
{ "code": 200, "message": "操作成功" }
```

### 4.4 修改菜单
- **Path**: `/system/menu`
- **Method**: `PUT`
- **请求参数**:
```typescript
interface UpdateMenuDto extends CreateMenuDto {
  menu_id: number;
}
```
- **响应示例**:
```json
{ "code": 200, "message": "操作成功" }
```

### 4.5 删除菜单
- **Path**: `/system/menu`
- **Method**: `DELETE`
- **请求参数** (Body):
```typescript
interface DeleteMenuDto {
  menu_id: number;
}
```
- **响应示例**:
```json
{ "code": 200, "message": "操作成功" }
```

---

## 5. 系统管理 - 部门管理 (Dept)

### 5.1 获取部门列表
- **Path**: `/system/dept/list`
- **Method**: `GET`
- **请求参数** (Query):
```typescript
interface ListDeptDto {
  dept_name?: string;
  status?: string;
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [{ "dept_id": 100, "dept_name": "若依科技", ... }]
}
```

### 5.2 获取部门详情
- **Path**: `/system/dept/:deptId`
- **Method**: `GET`
- **请求参数** (Path): `deptId`
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": { "dept_id": 100, ... }
}
```

### 5.3 新增部门
- **Path**: `/system/dept`
- **Method**: `POST`
- **请求参数**:
```typescript
interface CreateDeptDto {
  parent_id?: number;
  dept_name: string;
  order_num: number;
  leader?: string;
  phone?: string;
  email?: string;
  status?: string;
}
```
- **响应示例**:
```json
{ "code": 200, "message": "操作成功" }
```

### 5.4 修改部门
- **Path**: `/system/dept`
- **Method**: `PUT`
- **请求参数**:
```typescript
interface UpdateDeptDto extends CreateDeptDto {
  dept_id: number;
}
```
- **响应示例**:
```json
{ "code": 200, "message": "操作成功" }
```

### 5.5 删除部门
- **Path**: `/system/dept`
- **Method**: `DELETE`
- **请求参数** (Body):
```typescript
interface DeleteDeptDto {
  dept_id: number;
}
```
- **响应示例**:
```json
{ "code": 200, "message": "操作成功" }
```

---

## 6. 系统管理 - 岗位管理 (Post)

### 6.1 获取岗位列表
- **Path**: `/system/post/list`
- **Method**: `GET`
- **请求参数** (Query):
```typescript
interface ListPostDto {
  pageNum?: number;
  pageSize?: number;
  post_code?: string;
  post_name?: string;
  status?: string;
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "rows": [{ "post_id": 1, "post_code": "ceo", "post_name": "董事长", ... }],
    "total": 2
  }
}
```

### 6.2 获取岗位详情
- **Path**: `/system/post/:postId`
- **Method**: `GET`
- **请求参数** (Path): `postId`
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": { "post_id": 1, ... }
}
```

### 6.3 新增岗位
- **Path**: `/system/post`
- **Method**: `POST`
- **请求参数**:
```typescript
interface CreatePostDto {
  post_code: string;
  post_name: string;
  post_sort: number;
  status: string;
  remark?: string;
}
```
- **响应示例**:
```json
{ "code": 200, "message": "操作成功" }
```

### 6.4 修改岗位
- **Path**: `/system/post`
- **Method**: `PUT`
- **请求参数**:
```typescript
interface UpdatePostDto extends CreatePostDto {
  post_id: number;
}
```
- **响应示例**:
```json
{ "code": 200, "message": "操作成功" }
```

### 6.5 删除岗位
- **Path**: `/system/post`
- **Method**: `DELETE`
- **请求参数** (Body):
```typescript
interface DeletePostDto {
  post_ids: number[];
}
```
- **响应示例**:
```json
{ "code": 200, "message": "操作成功" }
```

---

## 7. 系统管理 - 字典管理 (Dict)

### 7.1 获取字典类型列表
- **Path**: `/system/dict/type/list`
- **Method**: `GET`
- **请求参数** (Query):
```typescript
interface ListDictTypeDto {
  pageNum?: number;
  pageSize?: number;
  dict_name?: string;
  dict_type?: string;
  status?: string;
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "rows": [{ "dict_id": 1, "dict_name": "用户性别", "dict_type": "sys_user_sex", ... }],
    "total": 10
  }
}
```

### 7.2 新增字典类型
- **Path**: `/system/dict/type`
- **Method**: `POST`
- **请求参数**:
```typescript
interface CreateDictTypeDto {
  dict_name: string;
  dict_type: string;
  status: string;
  remark?: string;
}
```
- **响应示例**:
```json
{ "code": 200, "message": "操作成功" }
```

### 7.3 获取字典数据列表
- **Path**: `/system/dict/data/list`
- **Method**: `GET`
- **请求参数** (Query):
```typescript
interface ListDictDataDto {
  pageNum?: number;
  pageSize?: number;
  dict_type?: string;
  dict_label?: string;
  status?: string;
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "rows": [{ "dict_code": 1, "dict_label": "男", "dict_value": "0", ... }],
    "total": 2
  }
}
```

### 7.4 根据类型获取字典数据
- **Path**: `/system/dict/data/type/:dictType`
- **Method**: `GET`
- **请求参数** (Path): `dictType`
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    { "dict_label": "男", "dict_value": "0", ... },
    { "dict_label": "女", "dict_value": "1", ... }
  ]
}
```

---

## 8. 系统管理 - 参数配置 (Config)

### 8.1 获取参数列表
- **Path**: `/system/config/list`
- **Method**: `GET`
- **请求参数** (Query):
```typescript
interface ListConfigDto {
  pageNum?: number;
  pageSize?: number;
  config_name?: string;
  config_key?: string;
  config_type?: string;
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "rows": [{ "config_id": 1, "config_key": "sys.index.skinName", ... }],
    "total": 5
  }
}
```

### 8.2 根据键名获取参数
- **Path**: `/system/config/configKey/:configKey`
- **Method**: `GET`
- **请求参数** (Path): `configKey`
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": "skin-blue"
}
```

---

## 9. 系统管理 - 通知公告 (Notice)

### 9.1 获取公告列表
- **Path**: `/system/notice/list`
- **Method**: `GET`
- **请求参数** (Query):
```typescript
interface ListNoticeDto {
  pageNum?: number;
  pageSize?: number;
  notice_title?: string;
  notice_type?: string;
  create_by?: string;
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "rows": [{ "notice_id": 1, "notice_title": "维护通知", ... }],
    "total": 1
  }
}
```

### 9.2 新增公告
- **Path**: `/system/notice`
- **Method**: `POST`
- **请求参数**:
```typescript
interface CreateNoticeDto {
  notice_title: string;
  notice_type: string;
  notice_content?: string;
  status?: string;
}
```
- **响应示例**:
```json
{ "code": 200, "message": "操作成功" }
```

---

## 10. 系统监控 - 登录日志 (Logininfor)

### 10.1 获取登录日志
- **Path**: `/monitor/logininfor/list`
- **Method**: `GET`
- **请求参数** (Query):
```typescript
interface ListLogininforDto {
  pageNum?: number;
  pageSize?: number;
  ipaddr?: string;
  user_name?: string;
  status?: string;
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "rows": [{ "info_id": 1, "user_name": "admin", "ipaddr": "127.0.0.1", ... }],
    "total": 50
  }
}
```

### 10.2 删除登录日志
- **Path**: `/monitor/logininfor`
- **Method**: `DELETE`
- **请求参数** (Body):
```typescript
interface DeleteLogininforDto {
  info_ids: number[];
}
```
- **响应示例**:
```json
{ "code": 200, "message": "操作成功" }
```

---

## 11. 系统监控 - 操作日志 (OperLog)

### 11.1 获取操作日志
- **Path**: `/monitor/operlog/list`
- **Method**: `GET`
- **请求参数** (Query):
```typescript
interface ListOperLogDto {
  pageNum?: number;
  pageSize?: number;
  title?: string;
  oper_name?: string;
  business_type?: string;
  status?: string;
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "rows": [{ "oper_id": 1, "title": "用户管理", "oper_name": "admin", ... }],
    "total": 100
  }
}
```

### 11.2 删除操作日志
- **Path**: `/monitor/operlog`
- **Method**: `DELETE`
- **请求参数** (Body):
```typescript
interface DeleteOperLogDto {
  oper_ids: number[];
}
```
- **响应示例**:
```json
{ "code": 200, "message": "操作成功" }
```

---

## 12. 系统监控 - 在线用户 (Online)

### 12.1 获取在线用户
- **Path**: `/monitor/online/list`
- **Method**: `GET`
- **请求参数** (Query):
```typescript
interface ListOnlineDto {
  pageNum?: number;
  pageSize?: number;
  ipaddr?: string;
  user_name?: string;
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "rows": [{ "tokenId": "uuid", "userName": "admin", "ipaddr": "127.0.0.1", ... }],
    "total": 1
  }
}
```

### 12.2 强退用户
- **Path**: `/monitor/online`
- **Method**: `DELETE`
- **请求参数** (Body):
```typescript
interface ForceLogoutDto {
  token_id: string; // Token ID
}
```
- **响应示例**:
```json
{ "code": 200, "message": "操作成功" }
```

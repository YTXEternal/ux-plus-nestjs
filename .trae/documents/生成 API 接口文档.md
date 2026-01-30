# API 文档生成计划

我将为您创建一个名为 `API_DOCS.md` 的 Markdown 文档，存放在项目根目录下。该文档将详细列出当前项目的所有 API 接口，格式适用于导入 Apifox 或手动测试。

## 文档结构概览

### 1. 认证模块 (Auth)
- 登录 (`POST /auth/login`)
- Token 验证测试 (`GET /auth/list`)

### 2. 系统管理模块 (System)
- **用户管理** (`/system/user`)：列表、详情、新增、修改、删除、重置密码、修改状态
- **角色管理** (`/system/role`)：列表、详情、新增、修改、删除、修改状态
- **菜单管理** (`/system/menu`)：列表、详情、新增、修改、删除、树形下拉
- **部门管理** (`/system/dept`)：列表、详情、新增、修改、删除
- **岗位管理** (`/system/post`)：列表、详情、新增、修改、删除
- **字典管理** (`/system/dict`)：类型/数据的增删改查
- **参数设置** (`/system/config`)：列表、详情、根据Key查询、新增、修改、删除
- **通知公告** (`/system/notice`)：列表、详情、新增、修改、删除

### 3. 系统监控模块 (Monitor)
- **操作日志** (`/monitor/operlog`)：列表、删除、清空
- **登录日志** (`/monitor/logininfor`)：列表、删除、清空、账户解锁
- **在线用户** (`/monitor/online`)：列表、强退

## 执行步骤
1.  在根目录创建 `API_DOCS.md` 文件。
2.  写入上述所有接口的详细信息，包括：
    *   请求方法 (Method)
    *   请求路径 (URL)
    *   请求参数说明 (Query / Body / Params)
    *   成功响应示例 (JSON)
    *   失败响应示例 (JSON)

## 验证
文档创建完成后，您可以使用 Markdown 阅读器查看，或将其内容复制到 Apifox 中进行接口调试。
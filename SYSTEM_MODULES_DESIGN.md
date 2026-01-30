# 系统管理模块接口与数据库设计文档

本文档详细描述了系统管理下各个模块的接口设计及对应的数据库表结构。

## 1. 用户管理 (User Management)

### 1.1 接口设计

| 接口名称 | 请求方式 | 请求路径 | 描述 | 参数 | 响应 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 获取用户列表 | GET | `/system/user/list` | 分页获取用户列表 | `pageNum`, `pageSize`, `userName`, `phonenumber`, `status`, `deptId` | 成功：`rows` (用户列表), `total`; 失败：错误信息 |
| 导出用户 | POST | `/system/user/export` | 导出用户数据 | `SysUser` 查询参数 | Excel 文件 |
| 导入用户 | POST | `/system/user/importData` | 导入用户数据 | `file` (Excel文件), `updateSupport` (是否更新) | 成功消息 |
| 导入模板 | POST | `/system/user/importTemplate` | 下载导入模板 | 无 | Excel 模板文件 |
| 获取详细信息 | GET | `/system/user/{userId}` | 根据ID获取用户详情 | `userId` (路径参数) | `data` (用户信息), `postIds`, `roleIds`, `roles`, `posts` |
| 新增用户 | POST | `/system/user` | 创建新用户 | JSON Body: `SysUser` 对象 (包含用户名, 密码, 部门, 角色等) | 成功状态 |
| 修改用户 | PUT | `/system/user` | 更新用户信息 | JSON Body: `SysUser` 对象 | 成功状态 |
| 删除用户 | DELETE | `/system/user/{userIds}` | 批量删除用户 | `userIds` (路径参数, 逗号分隔) | 成功状态 |
| 重置密码 | PUT | `/system/user/resetPwd` | 重置用户密码 | JSON Body: `SysUser` (包含 `userId`, `password`) | 成功状态 |
| 状态修改 | PUT | `/system/user/changeStatus` | 修改用户状态 | JSON Body: `SysUser` (包含 `userId`, `status`) | 成功状态 |
| 获取授权角色 | GET | `/system/user/authRole/{userId}` | 获取用户已分配角色 | `userId` (路径参数) | `user`, `roles` (包含选中状态) |
| 用户授权角色 | PUT | `/system/user/authRole` | 给用户分配角色 | Query: `userId`, `roleIds` (数组) | 成功状态 |
| 获取部门树 | GET | `/system/user/deptTree` | 获取部门树结构 | `SysDept` 查询参数 | 部门树数据 |

### 1.2 数据库表结构

#### 用户信息表 (`sys_user`)

```sql
drop table if exists sys_user;
create table sys_user (
  user_id           bigint(20)      not null auto_increment    comment '用户ID',
  dept_id           bigint(20)      default null               comment '部门ID',
  user_name         varchar(30)     not null                   comment '用户账号',
  nick_name         varchar(30)     not null                   comment '用户昵称',
  user_type         varchar(2)      default '00'               comment '用户类型（00系统用户）',
  email             varchar(50)     default ''                 comment '用户邮箱',
  phonenumber       varchar(11)     default ''                 comment '手机号码',
  sex               char(1)         default '0'                comment '用户性别（0男 1女 2未知）',
  avatar            varchar(100)    default ''                 comment '头像地址',
  password          varchar(100)    default ''                 comment '密码',
  status            char(1)         default '0'                comment '账号状态（0正常 1停用）',
  del_flag          char(1)         default '0'                comment '删除标志（0代表存在 2代表删除）',
  login_ip          varchar(128)    default ''                 comment '最后登录IP',
  login_date        datetime                                   comment '最后登录时间',
  pwd_update_date   datetime                                   comment '密码最后更新时间',
  create_by         varchar(64)     default ''                 comment '创建者',
  create_time       datetime                                   comment '创建时间',
  update_by         varchar(64)     default ''                 comment '更新者',
  update_time       datetime                                   comment '更新时间',
  remark            varchar(500)    default null               comment '备注',
  primary key (user_id)
) engine=innodb auto_increment=100 comment = '用户信息表';
```

### 1.3 初始数据

```sql
-- 初始化超级管理员账号 (账号: admin, 密码: admin123)
insert into sys_user values(1,  103, 'admin', '若依', '00', 'ry@163.com', '15888888888', '1', '', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', '0', '0', '127.0.0.1', sysdate(), sysdate(), 'admin', sysdate(), '', null, '管理员');
```

## 2. 角色管理 (Role Management)

### 2.1 接口设计

| 接口名称 | 请求方式 | 请求路径 | 描述 | 参数 | 响应 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 获取角色列表 | GET | `/system/role/list` | 分页获取角色列表 | `pageNum`, `pageSize`, `roleName`, `roleKey`, `status` | 成功：`rows` (角色列表), `total`; 失败：错误信息 |
| 导出角色 | POST | `/system/role/export` | 导出角色数据 | `SysRole` 查询参数 | Excel 文件 |
| 获取详细信息 | GET | `/system/role/{roleId}` | 根据ID获取角色详情 | `roleId` (路径参数) | `data` (角色信息) |
| 新增角色 | POST | `/system/role` | 创建新角色 | JSON Body: `SysRole` 对象 | 成功状态 |
| 修改角色 | PUT | `/system/role` | 更新角色信息 | JSON Body: `SysRole` 对象 | 成功状态 |
| 数据权限 | PUT | `/system/role/dataScope` | 修改角色数据权限 | JSON Body: `SysRole` 对象 | 成功状态 |
| 状态修改 | PUT | `/system/role/changeStatus` | 修改角色状态 | JSON Body: `SysRole` 对象 | 成功状态 |
| 删除角色 | DELETE | `/system/role/{roleIds}` | 批量删除角色 | `roleIds` (路径参数, 逗号分隔) | 成功状态 |
| 获取角色选择框 | GET | `/system/role/optionselect` | 获取所有角色 | 无 | 角色列表 |
| 已分配用户列表 | GET | `/system/role/authUser/allocatedList` | 获取角色已分配用户 | `roleId`, `pageNum`, `pageSize`, `userName`, `phonenumber` | 用户列表 |
| 未分配用户列表 | GET | `/system/role/authUser/unallocatedList` | 获取角色未分配用户 | `roleId`, `pageNum`, `pageSize`, `userName`, `phonenumber` | 用户列表 |
| 取消授权用户 | PUT | `/system/role/authUser/cancel` | 取消用户角色授权 | JSON Body: `SysUserRole` | 成功状态 |
| 批量取消授权 | PUT | `/system/role/authUser/cancelAll` | 批量取消授权 | `roleId`, `userIds` | 成功状态 |
| 批量选择授权 | PUT | `/system/role/authUser/selectAll` | 批量给用户授权角色 | `roleId`, `userIds` | 成功状态 |
| 角色部门树 | GET | `/system/role/deptTree/{roleId}` | 获取角色对应的部门树 | `roleId` | `checkedKeys` (选中部门ID), `depts` (部门树) |

### 2.2 数据库表结构

#### 角色信息表 (`sys_role`)

```sql
drop table if exists sys_role;
create table sys_role (
  role_id              bigint(20)      not null auto_increment    comment '角色ID',
  role_name            varchar(30)     not null                   comment '角色名称',
  role_key             varchar(100)    not null                   comment '角色权限字符串',
  role_sort            int(4)          not null                   comment '显示顺序',
  data_scope           char(1)         default '1'                comment '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）',
  menu_check_strictly  tinyint(1)      default 1                  comment '菜单树选择项是否关联显示',
  dept_check_strictly  tinyint(1)      default 1                  comment '部门树选择项是否关联显示',
  status               char(1)         not null                   comment '角色状态（0正常 1停用）',
  del_flag             char(1)         default '0'                comment '删除标志（0代表存在 2代表删除）',
  create_by            varchar(64)     default ''                 comment '创建者',
  create_time          datetime                                   comment '创建时间',
  update_by            varchar(64)     default ''                 comment '更新者',
  update_time          datetime                                   comment '更新时间',
  remark               varchar(500)    default null               comment '备注',
  primary key (role_id)
) engine=innodb auto_increment=100 comment = '角色信息表';
```

#### 关联表

```sql
-- 用户和角色关联表
drop table if exists sys_user_role;
create table sys_user_role (
  user_id   bigint(20) not null comment '用户ID',
  role_id   bigint(20) not null comment '角色ID',
  primary key(user_id, role_id)
) engine=innodb comment = '用户和角色关联表';

-- 角色和菜单关联表
drop table if exists sys_role_menu;
create table sys_role_menu (
  role_id   bigint(20) not null comment '角色ID',
  menu_id   bigint(20) not null comment '菜单ID',
  primary key(role_id, menu_id)
) engine=innodb comment = '角色和菜单关联表';

-- 角色和部门关联表
drop table if exists sys_role_dept;
create table sys_role_dept (
  role_id   bigint(20) not null comment '角色ID',
  dept_id   bigint(20) not null comment '部门ID',
  primary key(role_id, dept_id)
) engine=innodb comment = '角色和部门关联表';
```

## 3. 菜单管理 (Menu Management)

### 3.1 接口设计

| 接口名称 | 请求方式 | 请求路径 | 描述 | 参数 | 响应 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 获取菜单列表 | GET | `/system/menu/list` | 获取菜单列表 | `menuName`, `status` | 菜单列表 |
| 获取详细信息 | GET | `/system/menu/{menuId}` | 根据ID获取菜单详情 | `menuId` (路径参数) | 菜单信息 |
| 获取菜单树 | GET | `/system/menu/treeselect` | 获取菜单下拉树列表 | `menuName`, `status` | 菜单树数据 |
| 角色菜单树 | GET | `/system/menu/roleMenuTreeselect/{roleId}` | 获取角色对应的菜单树 | `roleId` | `checkedKeys`, `menus` |
| 新增菜单 | POST | `/system/menu` | 创建新菜单 | JSON Body: `SysMenu` 对象 | 成功状态 |
| 修改菜单 | PUT | `/system/menu` | 更新菜单信息 | JSON Body: `SysMenu` 对象 | 成功状态 |
| 删除菜单 | DELETE | `/system/menu/{menuId}` | 删除菜单 | `menuId` (路径参数) | 成功状态 |

### 3.2 数据库表结构

#### 菜单权限表 (`sys_menu`)

```sql
drop table if exists sys_menu;
create table sys_menu (
  menu_id           bigint(20)      not null auto_increment    comment '菜单ID',
  menu_name         varchar(50)     not null                   comment '菜单名称',
  parent_id         bigint(20)      default 0                  comment '父菜单ID',
  order_num         int(4)          default 0                  comment '显示顺序',
  path              varchar(200)    default ''                 comment '路由地址',
  component         varchar(255)    default null               comment '组件路径',
  query             varchar(255)    default null               comment '路由参数',
  route_name        varchar(50)     default ''                 comment '路由名称',
  is_frame          int(1)          default 1                  comment '是否为外链（0是 1否）',
  is_cache          int(1)          default 0                  comment '是否缓存（0缓存 1不缓存）',
  menu_type         char(1)         default ''                 comment '菜单类型（M目录 C菜单 F按钮）',
  visible           char(1)         default 0                  comment '菜单状态（0显示 1隐藏）',
  status            char(1)         default 0                  comment '菜单状态（0正常 1停用）',
  perms             varchar(100)    default null               comment '权限标识',
  icon              varchar(100)    default '#'                comment '菜单图标',
  create_by         varchar(64)     default ''                 comment '创建者',
  create_time       datetime                                   comment '创建时间',
  update_by         varchar(64)     default ''                 comment '更新者',
  update_time       datetime                                   comment '更新时间',
  remark            varchar(500)    default ''                 comment '备注',
  primary key (menu_id)
) engine=innodb auto_increment=2000 comment = '菜单权限表';
```

### 3.3 初始数据 (系统管理与系统监控)

```sql
-- 一级菜单 (系统管理, 系统监控)
insert into sys_menu values('1', '系统管理', '0', '1', 'system',           null, '', '', 1, 0, 'M', '0', '0', '', 'system',   'admin', sysdate(), '', null, '系统管理目录');
insert into sys_menu values('2', '系统监控', '0', '2', 'monitor',          null, '', '', 1, 0, 'M', '0', '0', '', 'monitor',  'admin', sysdate(), '', null, '系统监控目录');

-- 二级菜单 (用户, 角色, 菜单, 部门, 岗位, 字典, 参数, 通知, 日志, 在线用户)
insert into sys_menu values('100',  '用户管理', '1',   '1', 'user',       'system/user/index',        '', '', 1, 0, 'C', '0', '0', 'system:user:list',        'user',          'admin', sysdate(), '', null, '用户管理菜单');
insert into sys_menu values('101',  '角色管理', '1',   '2', 'role',       'system/role/index',        '', '', 1, 0, 'C', '0', '0', 'system:role:list',        'peoples',       'admin', sysdate(), '', null, '角色管理菜单');
insert into sys_menu values('102',  '菜单管理', '1',   '3', 'menu',       'system/menu/index',        '', '', 1, 0, 'C', '0', '0', 'system:menu:list',        'tree-table',    'admin', sysdate(), '', null, '菜单管理菜单');
insert into sys_menu values('103',  '部门管理', '1',   '4', 'dept',       'system/dept/index',        '', '', 1, 0, 'C', '0', '0', 'system:dept:list',        'tree',          'admin', sysdate(), '', null, '部门管理菜单');
insert into sys_menu values('104',  '岗位管理', '1',   '5', 'post',       'system/post/index',        '', '', 1, 0, 'C', '0', '0', 'system:post:list',        'post',          'admin', sysdate(), '', null, '岗位管理菜单');
insert into sys_menu values('105',  '字典管理', '1',   '6', 'dict',       'system/dict/index',        '', '', 1, 0, 'C', '0', '0', 'system:dict:list',        'dict',          'admin', sysdate(), '', null, '字典管理菜单');
insert into sys_menu values('106',  '参数设置', '1',   '7', 'config',     'system/config/index',      '', '', 1, 0, 'C', '0', '0', 'system:config:list',      'edit',          'admin', sysdate(), '', null, '参数设置菜单');
insert into sys_menu values('107',  '通知公告', '1',   '8', 'notice',     'system/notice/index',      '', '', 1, 0, 'C', '0', '0', 'system:notice:list',      'message',       'admin', sysdate(), '', null, '通知公告菜单');
insert into sys_menu values('108',  '日志管理', '1',   '9', 'log',        '',                         '', '', 1, 0, 'M', '0', '0', '',                        'log',           'admin', sysdate(), '', null, '日志管理菜单');
insert into sys_menu values('109',  '在线用户', '2',   '1', 'online',     'monitor/online/index',     '', '', 1, 0, 'C', '0', '0', 'monitor:online:list',     'online',        'admin', sysdate(), '', null, '在线用户菜单');

-- 三级菜单 (操作日志, 登录日志)
insert into sys_menu values('500',  '操作日志', '108', '1', 'operlog',    'monitor/operlog/index',    '', '', 1, 0, 'C', '0', '0', 'monitor:operlog:list',    'form',          'admin', sysdate(), '', null, '操作日志菜单');
insert into sys_menu values('501',  '登录日志', '108', '2', 'logininfor', 'monitor/logininfor/index', '', '', 1, 0, 'C', '0', '0', 'monitor:logininfor:list', 'logininfor',    'admin', sysdate(), '', null, '登录日志菜单');

-- 按钮 (用户管理)
insert into sys_menu values('1000', '用户查询', '100', '1',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:query',          '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1001', '用户新增', '100', '2',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:add',            '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1002', '用户修改', '100', '3',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:edit',           '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1003', '用户删除', '100', '4',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:remove',         '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1004', '用户导出', '100', '5',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:export',         '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1005', '用户导入', '100', '6',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:import',         '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1006', '重置密码', '100', '7',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:resetPwd',       '#', 'admin', sysdate(), '', null, '');

-- 按钮 (角色管理)
insert into sys_menu values('1007', '角色查询', '101', '1',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:query',          '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1008', '角色新增', '101', '2',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:add',            '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1009', '角色修改', '101', '3',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:edit',           '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1010', '角色删除', '101', '4',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:remove',         '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1011', '角色导出', '101', '5',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:export',         '#', 'admin', sysdate(), '', null, '');

-- 按钮 (菜单管理)
insert into sys_menu values('1012', '菜单查询', '102', '1',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:query',          '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1013', '菜单新增', '102', '2',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:add',            '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1014', '菜单修改', '102', '3',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:edit',           '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1015', '菜单删除', '102', '4',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:remove',         '#', 'admin', sysdate(), '', null, '');

-- 按钮 (部门管理)
insert into sys_menu values('1016', '部门查询', '103', '1',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:query',          '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1017', '部门新增', '103', '2',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:add',            '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1018', '部门修改', '103', '3',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:edit',           '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1019', '部门删除', '103', '4',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:remove',         '#', 'admin', sysdate(), '', null, '');

-- 按钮 (岗位管理)
insert into sys_menu values('1020', '岗位查询', '104', '1',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:query',          '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1021', '岗位新增', '104', '2',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:add',            '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1022', '岗位修改', '104', '3',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:edit',           '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1023', '岗位删除', '104', '4',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:remove',         '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1024', '岗位导出', '104', '5',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:export',         '#', 'admin', sysdate(), '', null, '');

-- 按钮 (字典管理)
insert into sys_menu values('1025', '字典查询', '105', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:query',          '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1026', '字典新增', '105', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:add',            '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1027', '字典修改', '105', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:edit',           '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1028', '字典删除', '105', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:remove',         '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1029', '字典导出', '105', '5', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:export',         '#', 'admin', sysdate(), '', null, '');

-- 按钮 (参数设置)
insert into sys_menu values('1030', '参数查询', '106', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:query',        '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1031', '参数新增', '106', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:add',          '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1032', '参数修改', '106', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:edit',         '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1033', '参数删除', '106', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:remove',       '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1034', '参数导出', '106', '5', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:export',       '#', 'admin', sysdate(), '', null, '');

-- 按钮 (通知公告)
insert into sys_menu values('1035', '公告查询', '107', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:query',        '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1036', '公告新增', '107', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:add',          '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1037', '公告修改', '107', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:edit',         '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1038', '公告删除', '107', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:remove',       '#', 'admin', sysdate(), '', null, '');

-- 按钮 (操作日志)
insert into sys_menu values('1039', '操作查询', '500', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:operlog:query',      '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1040', '操作删除', '500', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:operlog:remove',     '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1041', '日志导出', '500', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:operlog:export',     '#', 'admin', sysdate(), '', null, '');

-- 按钮 (登录日志)
insert into sys_menu values('1042', '登录查询', '501', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:query',   '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1043', '登录删除', '501', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:remove',  '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1044', '日志导出', '501', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:export',  '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1045', '账户解锁', '501', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:unlock',  '#', 'admin', sysdate(), '', null, '');

-- 按钮 (在线用户)
insert into sys_menu values('1046', '在线查询', '109', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:online:query',       '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1047', '批量强退', '109', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:online:batchLogout', '#', 'admin', sysdate(), '', null, '');
insert into sys_menu values('1048', '单条强退', '109', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:online:forceLogout', '#', 'admin', sysdate(), '', null, '');
```

## 4. 部门管理 (Department Management)

### 4.1 接口设计

| 接口名称 | 请求方式 | 请求路径 | 描述 | 参数 | 响应 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 获取部门列表 | GET | `/system/dept/list` | 获取部门列表 | `deptName`, `status` | 部门列表 |
| 排除节点列表 | GET | `/system/dept/list/exclude/{deptId}` | 获取排除指定节点及其子节点的列表 | `deptId` (路径参数) | 部门列表 |
| 获取详细信息 | GET | `/system/dept/{deptId}` | 根据ID获取部门详情 | `deptId` (路径参数) | 部门信息 |
| 新增部门 | POST | `/system/dept` | 创建新部门 | JSON Body: `SysDept` 对象 | 成功状态 |
| 修改部门 | PUT | `/system/dept` | 更新部门信息 | JSON Body: `SysDept` 对象 | 成功状态 |
| 删除部门 | DELETE | `/system/dept/{deptId}` | 删除部门 | `deptId` (路径参数) | 成功状态 |

### 4.2 数据库表结构

#### 部门表 (`sys_dept`)

```sql
drop table if exists sys_dept;
create table sys_dept (
  dept_id           bigint(20)      not null auto_increment    comment '部门id',
  parent_id         bigint(20)      default 0                  comment '父部门id',
  ancestors         varchar(50)     default ''                 comment '祖级列表',
  dept_name         varchar(30)     default ''                 comment '部门名称',
  order_num         int(4)          default 0                  comment '显示顺序',
  leader            varchar(20)     default null               comment '负责人',
  phone             varchar(11)     default null               comment '联系电话',
  email             varchar(50)     default null               comment '邮箱',
  status            char(1)         default '0'                comment '部门状态（0正常 1停用）',
  del_flag          char(1)         default '0'                comment '删除标志（0代表存在 2代表删除）',
  create_by         varchar(64)     default ''                 comment '创建者',
  create_time 	    datetime                                   comment '创建时间',
  update_by         varchar(64)     default ''                 comment '更新者',
  update_time       datetime                                   comment '更新时间',
  primary key (dept_id)
) engine=innodb auto_increment=200 comment = '部门表';
```

## 5. 岗位管理 (Post Management)

### 5.1 接口设计

| 接口名称 | 请求方式 | 请求路径 | 描述 | 参数 | 响应 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 获取岗位列表 | GET | `/system/post/list` | 分页获取岗位列表 | `pageNum`, `pageSize`, `postCode`, `postName`, `status` | 成功：`rows` (岗位列表), `total`; 失败：错误信息 |
| 导出岗位 | POST | `/system/post/export` | 导出岗位数据 | `SysPost` 查询参数 | Excel 文件 |
| 获取详细信息 | GET | `/system/post/{postId}` | 根据ID获取岗位详情 | `postId` (路径参数) | 岗位信息 |
| 新增岗位 | POST | `/system/post` | 创建新岗位 | JSON Body: `SysPost` 对象 | 成功状态 |
| 修改岗位 | PUT | `/system/post` | 更新岗位信息 | JSON Body: `SysPost` 对象 | 成功状态 |
| 删除岗位 | DELETE | `/system/post/{postIds}` | 批量删除岗位 | `postIds` (路径参数, 逗号分隔) | 成功状态 |
| 获取岗位选择框 | GET | `/system/post/optionselect` | 获取所有岗位 | 无 | 岗位列表 |

### 5.2 数据库表结构

#### 岗位信息表 (`sys_post`)

```sql
drop table if exists sys_post;
create table sys_post
(
  post_id       bigint(20)      not null auto_increment    comment '岗位ID',
  post_code     varchar(64)     not null                   comment '岗位编码',
  post_name     varchar(50)     not null                   comment '岗位名称',
  post_sort     int(4)          not null                   comment '显示顺序',
  status        char(1)         not null                   comment '状态（0正常 1停用）',
  create_by     varchar(64)     default ''                 comment '创建者',
  create_time   datetime                                   comment '创建时间',
  update_by     varchar(64)     default ''			       comment '更新者',
  update_time   datetime                                   comment '更新时间',
  remark        varchar(500)    default null               comment '备注',
  primary key (post_id)
) engine=innodb comment = '岗位信息表';
```

#### 用户与岗位关联表 (`sys_user_post`)

```sql
drop table if exists sys_user_post;
create table sys_user_post
(
  user_id   bigint(20) not null comment '用户ID',
  post_id   bigint(20) not null comment '岗位ID',
  primary key (user_id, post_id)
) engine=innodb comment = '用户与岗位关联表';
```

## 6. 字典管理 (Dictionary Management)

### 6.1 接口设计

#### 字典类型 (`/system/dict/type`)

| 接口名称 | 请求方式 | 请求路径 | 描述 | 参数 | 响应 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 获取类型列表 | GET | `/system/dict/type/list` | 分页获取字典类型列表 | `pageNum`, `pageSize`, `dictName`, `dictType`, `status` | 成功：`rows` (类型列表), `total`; 失败：错误信息 |
| 导出类型 | POST | `/system/dict/type/export` | 导出字典类型数据 | `SysDictType` 查询参数 | Excel 文件 |
| 获取详细信息 | GET | `/system/dict/type/{dictId}` | 根据ID获取字典类型详情 | `dictId` (路径参数) | 字典类型信息 |
| 新增类型 | POST | `/system/dict/type` | 创建新字典类型 | JSON Body: `SysDictType` 对象 | 成功状态 |
| 修改类型 | PUT | `/system/dict/type` | 更新字典类型信息 | JSON Body: `SysDictType` 对象 | 成功状态 |
| 删除类型 | DELETE | `/system/dict/type/{dictIds}` | 批量删除字典类型 | `dictIds` (路径参数, 逗号分隔) | 成功状态 |
| 刷新缓存 | DELETE | `/system/dict/type/refreshCache` | 刷新字典缓存 | 无 | 成功状态 |
| 获取类型选择框 | GET | `/system/dict/type/optionselect` | 获取所有字典类型 | 无 | 类型列表 |

#### 字典数据 (`/system/dict/data`)

| 接口名称 | 请求方式 | 请求路径 | 描述 | 参数 | 响应 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 获取数据列表 | GET | `/system/dict/data/list` | 分页获取字典数据列表 | `pageNum`, `pageSize`, `dictType`, `dictLabel`, `status` | 成功：`rows` (数据列表), `total`; 失败：错误信息 |
| 导出数据 | POST | `/system/dict/data/export` | 导出字典数据 | `SysDictData` 查询参数 | Excel 文件 |
| 获取详细信息 | GET | `/system/dict/data/{dictCode}` | 根据Code获取字典数据详情 | `dictCode` (路径参数) | 字典数据信息 |
| 根据类型查询 | GET | `/system/dict/data/type/{dictType}` | 根据字典类型获取数据列表 | `dictType` (路径参数) | 字典数据列表 |
| 新增数据 | POST | `/system/dict/data` | 创建新字典数据 | JSON Body: `SysDictData` 对象 | 成功状态 |
| 修改数据 | PUT | `/system/dict/data` | 更新字典数据信息 | JSON Body: `SysDictData` 对象 | 成功状态 |
| 删除数据 | DELETE | `/system/dict/data/{dictCodes}` | 批量删除字典数据 | `dictCodes` (路径参数, 逗号分隔) | 成功状态 |

### 6.2 数据库表结构

#### 字典类型表 (`sys_dict_type`)

```sql
drop table if exists sys_dict_type;
create table sys_dict_type
(
  dict_id          bigint(20)      not null auto_increment    comment '字典主键',
  dict_name        varchar(100)    default ''                 comment '字典名称',
  dict_type        varchar(100)    default ''                 comment '字典类型',
  status           char(1)         default '0'                comment '状态（0正常 1停用）',
  create_by        varchar(64)     default ''                 comment '创建者',
  create_time      datetime                                   comment '创建时间',
  update_by        varchar(64)     default ''                 comment '更新者',
  update_time      datetime                                   comment '更新时间',
  remark           varchar(500)    default null               comment '备注',
  primary key (dict_id),
  unique (dict_type)
) engine=innodb auto_increment=100 comment = '字典类型表';
```

#### 字典数据表 (`sys_dict_data`)

```sql
drop table if exists sys_dict_data;
create table sys_dict_data
(
  dict_code        bigint(20)      not null auto_increment    comment '字典编码',
  dict_sort        int(4)          default 0                  comment '字典排序',
  dict_label       varchar(100)    default ''                 comment '字典标签',
  dict_value       varchar(100)    default ''                 comment '字典键值',
  dict_type        varchar(100)    default ''                 comment '字典类型',
  css_class        varchar(100)    default null               comment '样式属性（其他样式扩展）',
  list_class       varchar(100)    default null               comment '表格回显样式',
  is_default       char(1)         default 'N'                comment '是否默认（Y是 N否）',
  status           char(1)         default '0'                comment '状态（0正常 1停用）',
  create_by        varchar(64)     default ''                 comment '创建者',
  create_time      datetime                                   comment '创建时间',
  update_by        varchar(64)     default ''                 comment '更新者',
  update_time      datetime                                   comment '更新时间',
  remark           varchar(500)    default null               comment '备注',
  primary key (dict_code)
) engine=innodb auto_increment=100 comment = '字典数据表';
```

## 7. 参数设置 (Parameter Settings)

### 7.1 接口设计

| 接口名称 | 请求方式 | 请求路径 | 描述 | 参数 | 响应 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 获取参数列表 | GET | `/system/config/list` | 分页获取参数列表 | `pageNum`, `pageSize`, `configName`, `configKey`, `configType` | 成功：`rows` (参数列表), `total`; 失败：错误信息 |
| 导出参数 | POST | `/system/config/export` | 导出参数数据 | `SysConfig` 查询参数 | Excel 文件 |
| 获取详细信息 | GET | `/system/config/{configId}` | 根据ID获取参数详情 | `configId` (路径参数) | 参数信息 |
| 根据Key查询 | GET | `/system/config/configKey/{configKey}` | 根据Key获取参数值 | `configKey` (路径参数) | 参数值 |
| 新增参数 | POST | `/system/config` | 创建新参数 | JSON Body: `SysConfig` 对象 | 成功状态 |
| 修改参数 | PUT | `/system/config` | 更新参数信息 | JSON Body: `SysConfig` 对象 | 成功状态 |
| 删除参数 | DELETE | `/system/config/{configIds}` | 批量删除参数 | `configIds` (路径参数, 逗号分隔) | 成功状态 |
| 刷新缓存 | DELETE | `/system/config/refreshCache` | 刷新参数缓存 | 无 | 成功状态 |

### 7.2 数据库表结构

#### 参数配置表 (`sys_config`)

```sql
drop table if exists sys_config;
create table sys_config (
  config_id         int(5)          not null auto_increment    comment '参数主键',
  config_name       varchar(100)    default ''                 comment '参数名称',
  config_key        varchar(100)    default ''                 comment '参数键名',
  config_value      varchar(500)    default ''                 comment '参数键值',
  config_type       char(1)         default 'N'                comment '系统内置（Y是 N否）',
  create_by         varchar(64)     default ''                 comment '创建者',
  create_time       datetime                                   comment '创建时间',
  update_by         varchar(64)     default ''                 comment '更新者',
  update_time       datetime                                   comment '更新时间',
  remark            varchar(500)    default null               comment '备注',
  primary key (config_id)
) engine=innodb auto_increment=100 comment = '参数配置表';
```

## 8. 通知公告 (Notice/Announcement)

### 8.1 接口设计

| 接口名称 | 请求方式 | 请求路径 | 描述 | 参数 | 响应 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 获取公告列表 | GET | `/system/notice/list` | 分页获取公告列表 | `pageNum`, `pageSize`, `noticeTitle`, `createBy`, `noticeType` | 成功：`rows` (公告列表), `total`; 失败：错误信息 |
| 获取详细信息 | GET | `/system/notice/{noticeId}` | 根据ID获取公告详情 | `noticeId` (路径参数) | 公告信息 |
| 新增公告 | POST | `/system/notice` | 创建新公告 | JSON Body: `SysNotice` 对象 | 成功状态 |
| 修改公告 | PUT | `/system/notice` | 更新公告信息 | JSON Body: `SysNotice` 对象 | 成功状态 |
| 删除公告 | DELETE | `/system/notice/{noticeIds}` | 批量删除公告 | `noticeIds` (路径参数, 逗号分隔) | 成功状态 |

### 8.2 数据库表结构

#### 通知公告表 (`sys_notice`)

```sql
drop table if exists sys_notice;
create table sys_notice (
  notice_id         int(4)          not null auto_increment    comment '公告ID',
  notice_title      varchar(50)     not null                   comment '公告标题',
  notice_type       char(1)         not null                   comment '公告类型（1通知 2公告）',
  notice_content    longblob        default null               comment '公告内容',
  status            char(1)         default '0'                comment '公告状态（0正常 1关闭）',
  create_by         varchar(64)     default ''                 comment '创建者',
  create_time       datetime                                   comment '创建时间',
  update_by         varchar(64)     default ''                 comment '更新者',
  update_time       datetime                                   comment '更新时间',
  remark            varchar(255)    default null               comment '备注',
  primary key (notice_id)
) engine=innodb auto_increment=10 comment = '通知公告表';
```

## 9. 日志管理 (Log Management)

### 9.1 接口设计

#### 操作日志 (`/monitor/operlog`)

| 接口名称 | 请求方式 | 请求路径 | 描述 | 参数 | 响应 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 获取日志列表 | GET | `/monitor/operlog/list` | 分页获取操作日志 | `pageNum`, `pageSize`, `title`, `operName`, `status` | 成功：`rows` (日志列表), `total` |
| 导出日志 | POST | `/monitor/operlog/export` | 导出操作日志 | `SysOperLog` 查询参数 | Excel 文件 |
| 删除日志 | DELETE | `/monitor/operlog/{operIds}` | 批量删除操作日志 | `operIds` (路径参数, 逗号分隔) | 成功状态 |
| 清空日志 | DELETE | `/monitor/operlog/clean` | 清空所有操作日志 | 无 | 成功状态 |

#### 登录日志 (`/monitor/logininfor`)

| 接口名称 | 请求方式 | 请求路径 | 描述 | 参数 | 响应 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 获取日志列表 | GET | `/monitor/logininfor/list` | 分页获取登录日志 | `pageNum`, `pageSize`, `ipaddr`, `userName`, `status` | 成功：`rows` (日志列表), `total` |
| 导出日志 | POST | `/monitor/logininfor/export` | 导出登录日志 | `SysLogininfor` 查询参数 | Excel 文件 |
| 删除日志 | DELETE | `/monitor/logininfor/{infoIds}` | 批量删除登录日志 | `infoIds` (路径参数, 逗号分隔) | 成功状态 |
| 清空日志 | DELETE | `/monitor/logininfor/clean` | 清空所有登录日志 | 无 | 成功状态 |
| 账户解锁 | GET | `/monitor/logininfor/unlock/{userName}` | 解锁登录账户 | `userName` (路径参数) | 成功状态 |

### 9.2 数据库表结构

#### 操作日志记录 (`sys_oper_log`)

```sql
drop table if exists sys_oper_log;
create table sys_oper_log (
  oper_id           bigint(20)      not null auto_increment    comment '日志主键',
  title             varchar(50)     default ''                 comment '模块标题',
  business_type     int(2)          default 0                  comment '业务类型（0其它 1新增 2修改 3删除）',
  method            varchar(100)    default ''                 comment '方法名称',
  request_method    varchar(10)     default ''                 comment '请求方式',
  operator_type     int(1)          default 0                  comment '操作类别（0其它 1后台用户 2手机端用户）',
  oper_name         varchar(50)     default ''                 comment '操作人员',
  dept_name         varchar(50)     default ''                 comment '部门名称',
  oper_url          varchar(255)    default ''                 comment '请求URL',
  oper_ip           varchar(128)    default ''                 comment '主机地址',
  oper_location     varchar(255)    default ''                 comment '操作地点',
  oper_param        varchar(2000)   default ''                 comment '请求参数',
  json_result       varchar(2000)   default ''                 comment '返回参数',
  status            int(1)          default 0                  comment '操作状态（0正常 1异常）',
  error_msg         varchar(2000)   default ''                 comment '错误消息',
  oper_time         datetime                                   comment '操作时间',
  cost_time         bigint(20)      default 0                  comment '消耗时间',
  primary key (oper_id),
  key idx_sys_oper_log_bt (business_type),
  key idx_sys_oper_log_s  (status),
  key idx_sys_oper_log_ot (oper_time)
) engine=innodb auto_increment=100 comment = '操作日志记录';
```

#### 系统访问记录 (`sys_logininfor`)

```sql
drop table if exists sys_logininfor;
create table sys_logininfor (
  info_id        bigint(20)     not null auto_increment   comment '访问ID',
  user_name      varchar(50)    default ''                comment '用户账号',
  ipaddr         varchar(128)   default ''                comment '登录IP地址',
  login_location varchar(255)   default ''                comment '登录地点',
  browser        varchar(50)    default ''                comment '浏览器类型',
  os             varchar(50)    default ''                comment '操作系统',
  status         char(1)        default '0'               comment '登录状态（0成功 1失败）',
  msg            varchar(255)   default ''                comment '提示消息',
  login_time     datetime                                 comment '访问时间',
  primary key (info_id),
  key idx_sys_logininfor_s  (status),
  key idx_sys_logininfor_lt (login_time)
) engine=innodb auto_increment=100 comment = '系统访问记录';
```

## 10. 在线用户 (Online User)

### 10.1 接口设计

| 接口名称 | 请求方式 | 请求路径 | 描述 | 参数 | 响应 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 获取在线用户列表 | GET | `/monitor/online/list` | 获取在线用户列表 | `ipaddr`, `userName` | `rows` (在线用户列表), `total` |
| 强退用户 | DELETE | `/monitor/online/{tokenId}` | 强退用户 | `tokenId` (路径参数) | 成功状态 |

### 10.2 数据存储

在线用户信息主要存储于 Redis 缓存中，通过 `CacheConstants.LOGIN_TOKEN_KEY` 进行管理，无对应的数据库实体表。

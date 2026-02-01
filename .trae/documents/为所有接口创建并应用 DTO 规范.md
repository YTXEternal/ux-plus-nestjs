我将执行以下计划，为每个控制器方法创建并应用强类型的 DTO。

### 第一步：创建 DTO 文件
我将按模块逐一创建 DTO 文件，每个 DTO 类都将使用 `class-validator` 装饰器进行验证。

1.  **System/User (`src/routes/system/user/dto/sys-user.dto.ts`)**
    *   `ListUserDto`: `pageNum`, `pageSize`, `userName`, `phonenumber`, `status`, `deptId`
    *   `CreateUserDto`: `userName`, `nickName`, `password`, `deptId`, `phonenumber`, `email`, `sex`, `status`, `remark`, `postIds`, `roleIds`
    *   `UpdateUserDto`: 继承 `CreateUserDto` (Partial), 增加 `userId`
    *   `ResetPwdDto`: `userId`, `password`
    *   `ChangeStatusDto`: `userId`, `status`

2.  **System/Role (`src/routes/system/role/dto/sys-role.dto.ts`)**
    *   `ListRoleDto`: `pageNum`, `pageSize`, `roleName`, `roleKey`, `status`
    *   `CreateRoleDto`: `roleName`, `roleKey`, `roleSort`, `status`, `remark`, `menuIds`
    *   `UpdateRoleDto`: 继承 `CreateRoleDto` (Partial), 增加 `roleId`
    *   `ChangeRoleStatusDto`: `roleId`, `status`

3.  **System/Menu (`src/routes/system/menu/dto/sys-menu.dto.ts`)**
    *   `ListMenuDto`: `menuName`, `status`
    *   `CreateMenuDto`: `parentId`, `menuName`, `orderNum`, `path`, `component`, `isFrame`, `isCache`, `menuType`, `visible`, `status`, `perms`, `icon`
    *   `UpdateMenuDto`: 继承 `CreateMenuDto` (Partial), 增加 `menuId`

4.  **System/Dept (`src/routes/system/dept/dto/sys-dept.dto.ts`)**
    *   `ListDeptDto`: `deptName`, `status`
    *   `CreateDeptDto`: `parentId`, `deptName`, `orderNum`, `leader`, `phone`, `email`, `status`
    *   `UpdateDeptDto`: 继承 `CreateDeptDto` (Partial), 增加 `deptId`

5.  **System/Post (`src/routes/system/post/dto/sys-post.dto.ts`)**
    *   `ListPostDto`: `pageNum`, `pageSize`, `postCode`, `postName`, `status`
    *   `CreatePostDto`: `postCode`, `postName`, `postSort`, `status`, `remark`
    *   `UpdatePostDto`: 继承 `CreatePostDto` (Partial), 增加 `postId`

6.  **System/Dict (`src/routes/system/dict/dto/sys-dict.dto.ts`)**
    *   **DictType**:
        *   `ListDictTypeDto`: `pageNum`, `pageSize`, `dictName`, `dictType`, `status`
        *   `CreateDictTypeDto`: `dictName`, `dictType`, `status`, `remark`
        *   `UpdateDictTypeDto`: 继承 `CreateDictTypeDto`, 增加 `dictId`
    *   **DictData**:
        *   `ListDictDataDto`: `pageNum`, `pageSize`, `dictType`, `dictLabel`, `status`
        *   `CreateDictDataDto`: `dictType`, `dictLabel`, `dictValue`, `cssClass`, `listClass`, `dictSort`, `status`, `remark`
        *   `UpdateDictDataDto`: 继承 `CreateDictDataDto`, 增加 `dictCode`

7.  **System/Config (`src/routes/system/config/dto/sys-config.dto.ts`)**
    *   `ListConfigDto`: `pageNum`, `pageSize`, `configName`, `configKey`, `configType`
    *   `CreateConfigDto`: `configName`, `configKey`, `configValue`, `configType`, `remark`
    *   `UpdateConfigDto`: 继承 `CreateConfigDto`, 增加 `configId`

8.  **System/Notice (`src/routes/system/notice/dto/sys-notice.dto.ts`)**
    *   `ListNoticeDto`: `pageNum`, `pageSize`, `noticeTitle`, `noticeType`, `createBy`
    *   `CreateNoticeDto`: `noticeTitle`, `noticeType`, `noticeContent`, `status`
    *   `UpdateNoticeDto`: 继承 `CreateNoticeDto`, 增加 `noticeId`

9.  **Monitor DTOs**
    *   `src/routes/monitor/logininfor/dto/sys-logininfor.dto.ts`: `ListLogininforDto`
    *   `src/routes/monitor/operlog/dto/sys-oper-log.dto.ts`: `ListOperLogDto`
    *   `src/routes/monitor/online/dto/sys-online.dto.ts`: `ListOnlineDto`

### 第二步：更新控制器
更新所有相关控制器文件，引入并使用上述定义好的 DTO 类来替换 `any`。

### 第三步：验证
运行构建以确保类型正确且没有编译错误。
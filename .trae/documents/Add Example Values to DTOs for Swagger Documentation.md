I will add `example` values to the `@ApiProperty` and `@ApiPropertyOptional` decorators in the following DTO files to ensure Swagger documentation is complete and easier to test.

### 1. Monitor Module
*   **`src/routes/monitor/logininfor/dto/sys-logininfor.dto.ts`**
    *   Add examples for `pageNum`, `pageSize`, `ipaddr`, `user_name`, `status`.
    *   Add example for `info_ids` in `DeleteLogininforDto`.
*   **`src/routes/monitor/online/dto/sys-online.dto.ts`**
    *   Add examples for `pageNum`, `pageSize`, `ipaddr`, `user_name`.
    *   Add example for `token_id` in `ForceLogoutDto`.
*   **`src/routes/monitor/operlog/dto/sys-oper-log.dto.ts`**
    *   Add examples for `pageNum`, `pageSize`, `title`, `oper_name`, `business_type`, `status`.
    *   Add example for `oper_ids` in `DeleteOperLogDto`.

### 2. System Module
*   **`src/routes/system/config/dto/sys-config.dto.ts`**
    *   Add examples for `ListConfigDto` fields.
    *   Add examples for `CreateConfigDto` fields (`config_name`, `config_key`, `config_value`, etc.).
    *   Add examples for `config_id` in `UpdateConfigDto` and `config_ids` in `DeleteConfigDto`.
*   **`src/routes/system/dept/dto/sys-dept.dto.ts`**
    *   Add examples for `ListDeptDto` fields.
    *   Add examples for `CreateDeptDto` fields (`dept_name`, `order_num`, `leader`, `phone`, `email`, etc.).
    *   Add examples for `dept_id` in `UpdateDeptDto` and `DeleteDeptDto`.
*   **`src/routes/system/dict/dto/sys-dict.dto.ts`**
    *   Add examples for `ListDictTypeDto` and `CreateDictTypeDto` fields.
    *   Add examples for `ListDictDataDto` and `CreateDictDataDto` fields.
    *   Add examples for IDs in update/delete DTOs.
*   **`src/routes/system/menu/dto/sys-menu.dto.ts`**
    *   Add examples for `ListMenuDto` fields.
    *   Add examples for `CreateMenuDto` fields (`menu_name`, `path`, `component`, `perms`, etc.).
    *   Add examples for `menu_id` in `UpdateMenuDto` and `DeleteMenuDto`.
*   **`src/routes/system/notice/dto/sys-notice.dto.ts`**
    *   Add examples for `ListNoticeDto` and `CreateNoticeDto` fields.
    *   Add examples for IDs in update/delete DTOs.
*   **`src/routes/system/post/dto/sys-post.dto.ts`**
    *   Add examples for `ListPostDto` and `CreatePostDto` fields.
    *   Add examples for IDs in update/delete DTOs.
*   **`src/routes/system/role/dto/sys-role.dto.ts`**
    *   Add examples for `ListRoleDto` and `CreateRoleDto` fields.
    *   Add examples for IDs in update/delete DTOs.
*   **`src/routes/system/user/dto/sys-user.dto.ts`**
    *   Fill in missing examples for `ListUserDto` (`user_name`, `phonenumber`, `status`, `dept_id`).
    *   Fill in missing examples for `CreateUserDto` (`dept_id`, `phonenumber`, `email`, `sex`, `status`, `remark`, `post_ids`, `role_ids`).

I will use standard example values (e.g., `pageNum: 1`, `pageSize: 10`, `status: '0'`) to make the documentation consistent.
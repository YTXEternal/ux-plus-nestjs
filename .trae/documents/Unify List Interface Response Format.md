I will unify the response format for all paginated list interfaces to match the required structure:
```json
{
  "page": "current page number",
  "list": "data array",
  "total": "total pages",
  "pageSize": "items per page (default 20)"
}
```

### Implementation Steps

1.  **Create Pagination Helper**:
    -   Create `src/tools/pagination.ts` with a `formatPagination` function.
    -   Export it in `src/tools/index.ts`.
    -   Logic: Accepts `rows`, `totalItems`, `pageNum`, `pageSize` and returns the formatted object with `total` calculated as `Math.ceil(totalItems / pageSize)`.

2.  **Update Services**:
    -   Modify `findAll` methods in the following services to change the default `pageSize` from `10` to `20`:
        -   `SysUserService`
        -   `SysRoleService`
        -   `SysPostService`
        -   `SysConfigService`
        -   `SysNoticeService`
        -   `SysDictService` (both `findAllType` and `findAllData`)
        -   `SysLogininforService`
        -   `SysOperLogService`
        -   `SysOnlineService`

3.  **Update Controllers**:
    -   Modify the `list` / `findAll` methods in the corresponding controllers to use `formatPagination`.
    -   Ensure the `pageSize` default of `20` is consistently applied/passed to the formatter.
    -   Controllers to update:
        -   `SysUserController`
        -   `SysRoleController`
        -   `SysPostController`
        -   `SysConfigController`
        -   `SysNoticeController`
        -   `SysDictController`
        -   `SysLogininforController`
        -   `SysOperLogController`
        -   `SysOnlineController`

4.  **Verification**:
    -   Verify that `SysMenu` and `SysDept` (tree structures) are left as is, as they are not standard paginated lists.
    -   Check that the `total` field now represents "total pages" instead of "total items".

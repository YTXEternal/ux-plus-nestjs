# 补全字典管理 del_flag 字段及逻辑

## 1. 数据库模型更新
在以下两个模型中添加 `del_flag` 字段，用于实现软删除逻辑：
- `src/databases/mysql-database/model/sys-dict-type.model.ts`: 添加 `del_flag` 字段定义。
- `src/databases/mysql-database/model/sys-dict-data.model.ts`: 添加 `del_flag` 字段定义。

字段定义参考规范：
```typescript
@Comment('删除标志（0代表存在 2代表删除）')
@Column({ type: DataType.CHAR(1), defaultValue: '0' })
del_flag: string;
```

## 2. 业务逻辑更新
修改 `src/routes/system/dict/sys-dict.service.ts` 文件：
- **移除 TypeScript 忽略注释**: 移除由于字段缺失而添加的 `// @ts-ignore`。
- **统一删除逻辑**:
    - `deleteType`: 确认保持软删除逻辑 (`update del_flag = '2'`)。
    - `deleteData`: 将当前的硬删除 (`destroy`) 改为软删除 (`update del_flag = '2'`)，保持与 Type 逻辑一致。
- **查询逻辑优化**: 确保所有查询方法 (`findAllType`, `findAllData`, `findDataByType`) 都包含 `del_flag: '0'` 的过滤条件。

## 3. 验证
- 确保 TypeScript 编译通过，无类型错误。
- 确保业务逻辑符合软删除设计。
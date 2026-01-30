# 修复 generateModelInterface.js 脚本计划

我将修复 `scripts/generateModelInterface.js` 脚本，使其能够正确解析当前项目中的 Sequelize 模型文件，生成对应的 TypeScript 接口定义。

## 问题分析
原脚本使用正则表达式 `/@[^@\n]*\n\s*declare\s+(\w+):\s+(\w+);/g` 来匹配属性，这导致了两个主要问题：
1.  **强制要求 `declare` 关键字**：当前模型文件（如 `sys-user.model.ts`）中的属性定义未使用 `declare` 关键字，导致匹配失败。
2.  **装饰器匹配脆弱**：原正则假设装饰器只有一行且紧邻属性，无法处理多行装饰器（如 `@PrimaryKey`、`@AutoIncrement`、`@Comment`、`@Column` 多行并存的情况）。

## 修复方案
我将重写 `scripts/generateModelInterface.js` 文件，主要改进如下：
1.  **更新正则表达式**：使用更健壮的正则 `/(?:^\s*@.*(?:\n|$))*\s*(?:declare\s+)?(\w+)\??\s*:\s*([^;]+);/gm`，支持：
    *   多行装饰器。
    *   可选的 `declare` 关键字。
    *   可选的属性问号 `?`。
    *   各种类型的属性定义。
2.  **完善关联属性排除逻辑**：确保 `HasOne`, `HasMany`, `BelongsTo`, `BelongsToMany` 等关联属性被正确排除，只保留数据库字段属性。
3.  **增加错误处理与日志**：添加文件路径检查和成功/失败日志，便于调试。

## 执行步骤
1.  使用 `Write` 工具重写 `scripts/generateModelInterface.js`。
2.  运行 `node scripts/generateModelInterface.js` 验证脚本是否能成功生成接口文件。
3.  检查生成的 `src/databases/mysql-database/interfaces/` 目录及文件内容是否正确。

## 验证
脚本执行成功后，应该在 `src/databases/mysql-database/interfaces/` 目录下看到 `sys-user.interface.ts` 等文件，且内容包含 `user_id`, `user_name` 等属性，但不包含 `roles`, `dept` 等关联对象。
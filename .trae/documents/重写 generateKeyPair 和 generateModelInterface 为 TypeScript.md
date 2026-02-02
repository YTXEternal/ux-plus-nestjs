我将执行以下步骤将两个脚本重写为 TypeScript 版本：

1. **删除旧文件**：

   * 删除 `scripts/generateKeyPair.js`

   * 删除 `scripts/generateModelInterface.js`

2. **创建** **`scripts/generateKeyPair.ts`**：

   * 使用 `import` 替代 `require`。

   * 为函数参数和返回值添加 TypeScript 类型定义（如 `GenerateOptions` 接口）。

   * 添加详细的 JSDoc 注释。

   * **修复逻辑缺陷**：原代码中 `isexist && createdDir()` 会导致目录不存在时不创建目录，从而报错。我将修正为 `if (!existsSync(targetDir)) { createdDir(); }` 以确保目录被正确创建。

3. **创建** **`scripts/generateModelInterface.ts`**：

   * 使用 `import` 替代 `require`。

   * 定义 `ClassProperty` 接口用于描述解析出的属性。

   * 添加详细的 JSDoc 注释。

   * 保留原有的正则解析和文件生成逻辑。

4. **验证**：

   * 检查 TypeScript 编译是否正常（通过 `ts-node` 运行检查）。


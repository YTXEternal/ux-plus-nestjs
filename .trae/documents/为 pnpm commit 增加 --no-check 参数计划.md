# 增加 pnpm commit 的 --no-check 参数

## 任务目标
为 `pnpm commit` 命令增加 `--no-check` 参数，用于跳过代码检查（lint）、单元测试（test）和端到端测试（e2e）。

## 实现步骤
1.  **修改脚本文件**：`scripts/git/pnpm-commit.js`
2.  **解析命令行参数**：获取 `process.argv` 中的参数。
3.  **添加判断逻辑**：
    - 检查参数中是否包含 `--no-check`。
    - 如果包含该参数，则跳过 `pnpm lint`、`pnpm test` 和 `pnpm test:e2e` 的执行。
    - 如果不包含，则保持原有逻辑，依次执行上述检查。
4.  **保持提交逻辑**：无论是否跳过检查，最终都执行 `pnpm exec cz` 进行交互式提交。

## 代码变更预览
在 `scripts/git/pnpm-commit.js` 中：

```javascript
// ... existing code ...

async function main() {
  // 获取命令行参数
  const args = process.argv.slice(2);
  const noCheck = args.includes('--no-check');

  if (!noCheck) {
    console.log('正在执行代码检查...');
    await run('pnpm', ['lint']);
    await run('pnpm', ['test']);
    await run('pnpm', ['test:e2e']);
  } else {
    console.log('已跳过代码检查 (--no-check)');
  }

  // ... existing code ...
}
```

## 验证方式
- 运行 `pnpm commit -- --no-check` 或 `pnpm commit --no-check`（取决于 pnpm 版本对参数传递的处理），确认是否跳过了检查步骤直接进入提交界面。

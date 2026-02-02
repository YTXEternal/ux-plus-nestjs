## 目标
- 禁止直接执行 `git commit`（含 amend/revert/cherry-pick 等触发 commit 的动作），必须走 `pnpm commit`。
- `pnpm commit` 在进入交互式提交前，按顺序执行：`pnpm lint` → `pnpm test` → `pnpm test:e2e`；任一失败立即阻止提交。

## 现状结论（基于仓库扫描）
- 当前 `pnpm commit` 仅执行 `pnpm lint && npx cz`，未包含 `test/test:e2e`。
- 仓库目前没有 Husky / Git hooks，因此无法阻止用户直接 `git commit`。

## 实施方案（将“规则”落到 Git hooks + pnpm 脚本）
### 1) 引入 Husky 作为统一的 Git hooks 管理
- 新增 devDependencies：`husky`
- 在 `package.json` 新增/调整脚本：`"prepare": "husky install"`
- 新增 `.husky/pre-commit`：在任何提交发生前做“入口校验”，不通过则直接退出。

### 2) 通过 pre-commit 入口校验阻止 `git commit`
- 新增脚本 `scripts/ensure-pnpm-commit.js`（Node 脚本，便于 Windows 兼容和输出中文提示）
- `.husky/pre-commit` 仅执行：`node scripts/ensure-pnpm-commit.js`
- 校验逻辑：
  - 允许：当环境变量满足“由 pnpm commit 触发”的特征（例如 `npm_lifecycle_event === 'commit'` 或自定义 `UX_PNPM_COMMIT=1`）
  - 阻止：不满足时退出码 1，并输出明确提示：
    - “检测到直接使用 git commit，已阻止。请使用 pnpm commit 进行统一提交。”

### 3) 改造 `pnpm commit`：先跑 lint/test/e2e，再进入交互式提交
- 新增脚本 `scripts/pnpm-commit.js`：
  - 依次执行：`pnpm lint`、`pnpm test`、`pnpm test:e2e`
  - 全部通过后，执行 `pnpm exec cz`（替换 `npx cz`，更符合 pnpm 生态）
  - 在启动 `cz` 前注入 `UX_PNPM_COMMIT=1`（确保 hooks 能识别这是“合法入口”）
- 更新 `package.json`：`"commit": "node scripts/pnpm-commit.js"`

## 兼容性与说明
- Windows 兼容：所有关键逻辑用 Node 脚本实现；Husky hook 只做最小调用。
- 说明：任何 Git hooks 都可以被 `--no-verify` 绕过（Git 原生机制）。本方案能覆盖绝大多数正常提交路径，并提供明确提示。

## 验证方式（实施后我会做的检查）
- `git commit -m "test"`：应被阻止并提示改用 `pnpm commit`。
- `pnpm commit`：应先跑 lint/test/e2e，全部通过后才进入 cz 提交流程；失败时不进入 cz。
- `pnpm lint`/`pnpm test`/`pnpm test:e2e` 仍可单独执行且行为不变。
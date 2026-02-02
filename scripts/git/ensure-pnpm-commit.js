/**
 * 校验当前提交是否通过 `pnpm commit` 入口触发。
 *
 * 设计目标：
 * - 阻止开发者直接执行 `git commit` 进行提交
 * - 引导统一使用 `pnpm commit`，以便在提交前执行项目约束（lint/test/e2e）
 *
 * 注意：
 * - Git 原生支持 `--no-verify` 跳过 hooks，本校验无法覆盖该场景
 */

const allowEnvValue = '1';

/**
 * 判断是否为允许的提交入口。
 * @returns {boolean} 是否允许继续提交
 */
function isAllowedCommitEntry() {
  if (process.env.UX_PNPM_COMMIT === allowEnvValue) {
    return true;
  }

  if (process.env.npm_lifecycle_event === 'commit') {
    return true;
  }

  return false;
}

if (!isAllowedCommitEntry()) {
  console.error('');
  console.error('已阻止提交：检测到直接使用 git commit。');
  console.error('请使用 pnpm commit 进行统一提交，以确保提交前检查通过。');
  console.error('');
  console.error('正确方式：');
  console.error('  pnpm commit');
  console.error('');
  process.exit(1);
}


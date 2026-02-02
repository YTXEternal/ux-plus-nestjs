/**
 * 初始化项目 Git hooks 路径。
 *
 * 目标：
 * - 将 Git hooks 统一指向仓库内的 `.husky` 目录
 * - 确保 `pnpm install` 后自动生效，无需开发者手工配置
 *
 * 注意：
 * - 若当前目录不是 Git 仓库（例如打包、发布、某些 CI 场景），将自动跳过
 */

const { spawnSync } = require('node:child_process');
const { existsSync } = require('node:fs');
const { join } = require('node:path');

/**
 * 执行 git config 命令。
 * @param {string[]} args 参数
 * @returns {number} 退出码
 */
function runGitConfig(args) {
  const result = spawnSync('git', ['config', ...args], {
    stdio: 'inherit',
    shell: true,
  });

  return result.status ?? 1;
}

function main() {
  const gitDir = join(process.cwd(), '.git');

  if (!existsSync(gitDir)) {
    return;
  }

  const code = runGitConfig(['core.hooksPath', '.husky']);
  if (code !== 0) {
    process.exit(code);
  }
}

main();


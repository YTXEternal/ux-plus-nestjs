/**
 * `pnpm commit` 的统一入口。
 *
 * 执行流程：
 * 1. pnpm lint
 * 2. pnpm test
 * 3. pnpm test:e2e
 * 4. 全部通过后进入交互式提交（commitizen：cz）
 */

const { spawn } = require('node:child_process');

/**
 * 执行子进程命令。
 * @param {string} command 命令
 * @param {string[]} args 参数
 * @param {NodeJS.ProcessEnv} [env] 环境变量
 * @returns {Promise<void>} 执行结果
 */
function run(command, args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      env: env ?? process.env,
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} 执行失败，退出码：${code ?? 'unknown'}`));
    });

    child.on('error', reject);
  });
}

async function main() {
  await run('pnpm', ['lint']);
  await run('pnpm', ['test']);
  await run('pnpm', ['test:e2e']);

  const env = {
    ...process.env,
    UX_PNPM_COMMIT: '1',
  };

  await run('pnpm', ['exec', 'cz'], env);
}

main().catch((error) => {
  console.error(error?.message ?? error);
  process.exit(1);
});


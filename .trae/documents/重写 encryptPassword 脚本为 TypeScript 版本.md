我将执行以下步骤来完成任务：

1.  **删除旧文件**：删除空的 `scripts/encryptPassword.js` 文件。
2.  **创建新脚本**：创建 `scripts/encryptPassword.ts`，并使用 TypeScript 和 ES 模块语法编写。
    *   引入 `dotenv/config` 以自动加载环境变量。
    *   通过相对路径或别名引入 `UxCryptoRsaService` 和 `UxPasswordService`。
    *   创建一个 Mock 的 `ConfigService`，将 `.get()` 方法指向 `process.env`，以满足 `UxCryptoRsaService` 的依赖。
    *   手动实例化 `UxCryptoRsaService` 和 `UxPasswordService`，复用现有的加密逻辑。
    *   读取命令行参数作为明文密码，调用 `encryptedPassword` 方法，并将结果输出到控制台。
3.  **验证**：我会尝试运行一次该脚本（需要你确认是否允许我运行命令，或者我直接提供运行指令），确保它能正确输出加密后的密码。

**注意**：
由于项目内部使用了 `@/` 路径别名（例如 `UxPasswordService` 引用了 `@/tools`），运行该脚本时需要注册路径别名。我会在脚本头部添加注释说明运行命令：
`npx ts-node -r tsconfig-paths/register scripts/encryptPassword.ts <your_password>`

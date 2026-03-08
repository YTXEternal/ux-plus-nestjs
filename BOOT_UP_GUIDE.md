# 编程小白保姆级启动指南 🚀

你好！欢迎来到这个项目。我知道你可能对编程还不太熟悉，别担心，这份指南就是专门为你准备的。只要按照下面的步骤一步步操作，你一定能成功启动这个项目！

## 第一步：安装必要软件 (环境准备)

在运行项目之前，我们需要安装一些基础软件。就像做饭需要先准备锅碗瓢盆一样。

### 1. 安装 Node.js
Node.js 是运行这个项目的核心环境。
- **下载地址**: [https://nodejs.org/zh-cn/](https://nodejs.org/zh-cn/)
- **如何选择**: 进入页面后，下载左边的 **LTS 版本** (长期支持版)，这个版本最稳定。
- **安装**: 下载后双击安装包，一路点击 "Next" (下一步) 直到安装完成即可。

### 2. 安装 pnpm
pnpm 是一个用来管理项目依赖的工具，比传统的 npm 更快更好用。
- **安装方法**:
  1. 按下 `Win + R` 键，输入 `cmd`，然后回车，打开黑色的命令窗口。
  2. 在窗口中输入以下命令并回车：
     ```bash
     # 换源码
     npm config set registry https://registry.npmmirror.com/
     pnpm config set registry https://registry.npmmirror.com/
     # 安装 pnpm
     npm install -g pnpm
     ```
  3. 等待进度条跑完，如果没报错，就安装好了。

### 3. 安装 MySQL 数据库
MySQL 是用来存储数据的仓库。
- **下载地址**: [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)
- 具体安装教程：[【2025 最新】 MySQL 数据库安装教程（超详细图文版）：从下载到配置一步到位_mysql安装-CSDN博客](https://blog.csdn.net/qq_51572290/article/details/154783156)
- **选择**: 选择 `mysql-installer-community` (体积比较大的那个)。
- **安装注意**:
  - 安装过程中会让你设置 **root 用户的密码**，**请一定要记住这个密码！** 后面配置项目时会用到。
  - 也就是所谓的 "Database Password"。建议设置简单点，比如 `123456` (仅限本地开发使用)。
  - 确保安装完成后 MySQL 服务已经启动。

---

## 第二步：安装项目依赖

现在环境准备好了，我们需要下载项目运行所需的各种 "零件" (依赖包)。

1. **打开项目文件夹**:
   
   - 确保你已经下载了本项目代码。
   - 在项目根目录下 (也就是能看到 `package.json` 文件的那个文件夹)，右键点击空白处，选择 "在终端中打开" (或者 "Open in Terminal")。
   - 如果没有这个选项，可以在地址栏输入 `cmd` 并回车。
   
2. **输入安装命令**:
   在弹出的黑框框里输入：
   ```bash
   pnpm install
   ```
   然后回车。你会看到很多字符在跳动，这是在下载东西，耐心等待它跑完。

---

## 第三步：配置项目

我们需要告诉项目，数据库在哪里，密码是多少。

1. **找到配置文件**:
   在项目文件夹里找到名为 `.env` 的文件。

2. **修改数据库密码**:
   用记事本或者你喜欢的代码编辑器打开 `.env` 文件。
   找到大概第 40 行左右的 `MYSQL` 配置部分：
   ```properties
   # MYSQL
   MYSQL_BOOT_UP=true
   MYSQL_USERNAME=root
   MYSQL_PASSWORD=123456  <-- 这里改成你安装 MySQL 时设置的密码
   MYSQL_PORT=3306
   MYSQL_HOST=127.0.0.1
   MYSQL_DATABASE=platform
   ```
   **注意**: 只需要修改 `MYSQL_PASSWORD` 这一项，其他的通常不需要动。

---

## 第四步：初始化项目

1. **初始化数据库**:
   接着输入：
   ```bash
   pnpm mysql:init
   ```
   回车。
   - 如果提示 `SQL 脚本执行成功！`，那就太棒了！
   - 如果报错说 `ER_ACCESS_DENIED_ERROR`，那通常是 `.env` 里的密码填错了，回去检查一下。
   - 如果报错说 `ECONNREFUSED`，那说明你的 MySQL 软件没启动，去检查一下 MySQL 服务。

---

## 第五步：启动项目！🎉

终于到了最激动人心的时刻了。

1. **启动命令**:
   在终端输入：
   ```bash
   pnpm start:dev
   ```
   回车。

2. **等待启动**:
   你会看到屏幕上出现很多绿色的日志。当看到类似 `Nest application successfully started` 的字样时，说明启动成功了！

3. **验证一下**:
   打开浏览器，访问：[http://localhost:3000](http://localhost:3000)
   如果你能看到一个 Swagger 文档页面 (接口文档)，那么恭喜你，你已经成功把这个后端项目跑起来了！👏

---

## 常见问题 (Q&A)

**Q: 输入命令显示 "不是内部或外部命令"？**
A: 这通常是因为 Node.js 没安装好，或者没配置环境变量。尝试重启一下电脑，或者重新安装 Node.js。

**Q: 启动时报错 `EADDRINUSE: address already in use :::3000`？**
A: 这说明 3000 端口被占用了 (可能是你打开了两个黑框框都运行了项目)。关掉所有黑框框，重新打开一个试试。

**Q: 只有 MySQL 吗？Redis 和 MongoDB 呢？**
A: 本项目默认开启了 MySQL。如果你是初学者，暂时只需要关注 MySQL。如果你以后需要用到 Redis 或 MongoDB，可以在 `.env` 文件里把 `REDIS_BOOT_UP` 或 `MONGODB_BOOT_UP` 改为 `true`，当然前提是你也安装了它们。

祝你学习愉快！如果还有问题，随时来问我。

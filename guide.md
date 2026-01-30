# 项目运行指南

本指南将帮助你快速搭建和运行 @ux-plus/nestjs 后端项目。

## 1. 环境准备

在开始之前，请确保你的开发环境满足以下要求：

- **操作系统**: Windows / macOS / Linux
- **Node.js**: >= 18.0.0 (推荐使用 LTS 版本)
- **包管理器**: [pnpm](https://pnpm.io/) (本项目强制使用 pnpm)
- **数据库**:
  - MySQL (>= 5.7)
  - MongoDB (>= 4.0)
  - Redis (>= 5.0)

## 2. 安装项目

克隆项目到本地后，使用 pnpm 安装依赖：

```bash
pnpm install
```

## 3. 配置文件
.env.test 对应测试环境
.env.production 对应生产环境
.env.development 对应开发环境
.env 默认环境，默认情况下会加载这个文件



### 关键配置项说明

打开 `.env` 文件，根据你的实际环境修改以下配置：

**数据库配置**
```properties
# MySQL
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USERNAME=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=platform

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# MongoDB
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_USERNAME=root
MONGODB_PASSWORD=your_password
```

**邮件服务 (SMTP)**
```properties
SMTP_HOST=smtp.qq.com
SMTP_PORT=587
SMTP_EMAIL=your_email@example.com
SMTP_EMAIL_CODE=your_auth_code
```

**JWT 与 安全配置**
```properties
# JWT 过期时间配置
JWT_GLOBAL_EXPIRES_IN=7h
JWT_LOGIN_TOKEN_EXPIRES=30d

# CPU 过载保护阈值
CPU_MAX_THRESHOLD=640 # 建议设置为: 核心数 * 80
```

## 4. 初始化流程

在首次运行项目前，需要执行以下初始化步骤：

### 4.1 生成密钥对
项目使用 RSA 非对称加密，需要生成公私钥对：

```bash
pnpm genkey
```
> 该命令会在 `keys/` 和 `jwt_rsa_key/` 目录下生成所需的 `.pem` 文件。

### 4.2 生成模型接口
根据数据库模型生成对应的 TypeScript 接口定义：

```bash
pnpm gmodelinter
```

### 4.3 数据库初始化
你可以使用 `docker-init-scripts` 目录下的脚本来初始化数据库结构：

- **MySQL**: 使用 `docker-init-scripts/mysql/mysqlinit.sql` 导入初始表结构。
- **MongoDB**: 使用 `docker-init-scripts/mongo/mongodinit.js` 初始化集合（如果需要）。

## 5. 启动项目

### 开发环境
启动开发服务器，支持热重载：

```bash
pnpm start:dev
```
启动成功后，API 服务默认运行在 `http://localhost:3000`。

### 生产环境
构建并以生产模式运行：

```bash
pnpm build
pnpm start:prod
```
生产环境使用 PM2 进行进程管理（需确保 `ecosystem.config.js` 配置正确）。

## 6. 测试

### 单元测试
运行所有单元测试文件 (`*.spec.ts`)：

```bash
pnpm test
```

### 端到端测试 (E2E)
运行端到端集成测试：

```bash
pnpm test:e2e
```

## 7. 目录结构说明

项目的核心代码位于 `src` 目录下，遵循模块化设计：

```text
src/
├── databases/          # 数据库连接与模型配置 (MySQL, MongoDB)
├── routes/             # 业务路由模块 (Controller, Service)
│   ├── auth/           # 认证模块
│   └── registry/       # 注册模块
├── modules/            # 核心通用模块
│   ├── redis/          # Redis 缓存服务
│   ├── ux-jwt/         # JWT 认证服务
│   └── cpu-overload/   # CPU 过载保护
├── services/           # 独立基础服务 (Email, RSA Crypto)
├── guards/             # 路由守卫 (AuthToken, ServiceAvailability)
├── interceptors/       # 拦截器 (XSS 过滤)
├── filters/            # 全局异常过滤器
├── tools/              # 通用工具函数
└── main.ts             # 应用入口文件
```

## 简介

根据RESTful API软件设计风格并基于NestJS框架开发的一款后端开发模板集成了数据库(Mysql，Mongodb)、缓存(Redis)、非对称算法RSA，实现了基本的身份验证守卫以及CPU过载保护。它帮你集成了大部分基础功能让你可以专注于主要的业务开发

**接口：**
- 注册账号
- 注册账号验证码
- 登陆账号

**守卫：**
- 鉴权（token）
- CPU过载保护

**拦截器：**
- xss过滤

**功能：**
- 发送邮箱
- RSA加密

**集成：**
- mysql(以sequelize集成)
- mongodb
- redis
- serve-static(静态资源服务)
- cookie-parser
- express-rate-limit(速率限制中间件)
- Nodemailer(邮箱服务)
- md5
- @nestjs/swagger(生成接口文档)
- eslint

**测试：**
- 集成测试
- 单元测试
- 端到端测试

使用文档：
[ux-plus-nestjs](www.ux-plus-nestjs.cn "ux-plus-nestjs")
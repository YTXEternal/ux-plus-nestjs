import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { createConnection } from 'mysql2/promise';

// 加载环境变量
dotenv.config({ path: path.join(process.cwd(), '.env') });

const DATA_DIR = path.join(process.cwd(), 'scripts', 'database', 'mysql', 'data');

async function main() {
  // 解析命令行参数
  const args = process.argv.slice(2);
  let type = 'init'; // 默认为 init (固定初始数据)
  
  // 简单的参数解析，支持 --type=xxx 或直接传 type 值
  args.forEach(arg => {
    if (arg.startsWith('--type=')) {
      type = arg.split('=')[1];
    }
  });

  if (type !== 'init' && type !== 'latest') {
    console.error(`无效的类型参数: ${type}。请使用 'init' 或 'latest'。`);
    process.exit(1);
  }

  const sqlFile = path.join(DATA_DIR, `${type}.sql`);
  console.log(`准备执行 MySQL 初始化脚本...`);
  console.log(`使用数据源: ${type} (${sqlFile})`);

  if (!fs.existsSync(sqlFile)) {
    if (type === 'init') {
      console.error(`错误: 未找到固定初始数据文件 (init.sql)。`);
      console.error(`请手动提供该文件，或将 'latest.sql' 复制为 'init.sql'。`);
    } else {
      console.error(`错误: 未找到文件 ${sqlFile}`);
      console.error(`请先运行 generate 脚本生成 latest.sql。`);
    }
    process.exit(1);
  }

  const host = process.env.MYSQL_HOST || 'localhost';
  const port = Number(process.env.MYSQL_PORT) || 3306;
  const user = process.env.MYSQL_USERNAME || 'root';
  const password = process.env.MYSQL_PASSWORD || 'root';
  const database = process.env.MYSQL_DATABASE || 'ux_plus_nestjs';

  console.log(`连接到数据库服务器: ${host}:${port}, user: ${user}`);
  console.log(`注意：SQL 脚本内包含 USE \`${database}\` 语句，无需预先指定数据库。`);

  let connection;
  try {
    connection = await createConnection({
      host,
      port,
      user,
      password,
      // 不指定 database，让 SQL 脚本自己处理 CREATE DATABASE 和 USE
      multipleStatements: true
    });

    const sqlContent = fs.readFileSync(sqlFile, 'utf-8');
    
    console.log('正在执行 SQL 脚本，这可能需要一点时间...');
    
    // 执行 SQL
    await connection.query(sqlContent);
    
    console.log('SQL 脚本执行成功！数据库已初始化。');
  } catch (error: any) {
    console.error('执行失败:', error.message);
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`数据库 '${database}' 不存在，请先创建数据库。`);
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

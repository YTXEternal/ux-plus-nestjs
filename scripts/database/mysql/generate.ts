import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { createConnection } from 'mysql2/promise';

// 加载环境变量
dotenv.config({ path: path.join(process.cwd(), '.env') });

const OUTPUT_DIR = path.join(process.cwd(), 'scripts', 'database', 'mysql', 'data');
const LATEST_FILE = path.join(OUTPUT_DIR, 'latest.sql');

async function main() {
  console.log(`开始生成 MySQL 数据库备份 (Dump)...`);
  console.log(`目标文件: ${LATEST_FILE}`);
  
  // 检查输出目录
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const host = process.env.MYSQL_HOST || 'localhost';
  const port = Number(process.env.MYSQL_PORT) || 3306;
  const user = process.env.MYSQL_USERNAME || 'root';
  const password = process.env.MYSQL_PASSWORD || 'root';
  const database = process.env.MYSQL_DATABASE || 'ux_plus_nestjs';

  console.log(`连接到数据库: ${host}:${port}, database: ${database}`);

  let connection;
  try {
    connection = await createConnection({
      host,
      port,
      user,
      password,
      database,
      multipleStatements: true,
      dateStrings: true // 保持日期为字符串格式，避免JS Date转换问题
    });

    // 获取所有表
    const [tables] = await connection.query('SHOW TABLES');
    const tableList = (tables as any[]).map(row => Object.values(row)[0] as string);

    if (tableList.length === 0) {
      console.warn('数据库中没有表。');
      return;
    }

    let sqlContent = `-- MySQL Dump generated at ${new Date().toISOString()}\n`;
    sqlContent += `-- Database: ${database}\n\n`;
    sqlContent += `SET NAMES utf8mb4;\n`;
    sqlContent += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

    // 添加创建数据库语句
    sqlContent += `-- Create Database \`${database}\` if not exists\n`;
    sqlContent += `CREATE DATABASE IF NOT EXISTS \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n`;
    sqlContent += `USE \`${database}\`;\n\n`;

    for (const tableName of tableList) {
      console.log(`处理表: ${tableName}`);

      // 1. 生成 Drop 语句
      sqlContent += `-- Table structure for table \`${tableName}\`\n`;
      sqlContent += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;

      // 2. 生成 Create 语句
      const [createResult] = await connection.query(`SHOW CREATE TABLE \`${tableName}\``);
      const createSql = (createResult as any[])[0]['Create Table'];
      sqlContent += `${createSql};\n\n`;

      // 3. 生成 Insert 语句
      const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);
      const data = rows as any[];

      if (data.length > 0) {
        sqlContent += `-- Dumping data for table \`${tableName}\`\n`;
        // 分批插入，防止SQL过长
        const chunkSize = 100;
        for (let i = 0; i < data.length; i += chunkSize) {
          const chunk = data.slice(i, i + chunkSize);
          const values = chunk.map(row => {
            const cols = Object.values(row).map(val => {
              if (val === null) return 'NULL';
              if (typeof val === 'number') return val;
              // 转义单引号和反斜杠
              return `'${String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
            });
            return `(${cols.join(', ')})`;
          });
          sqlContent += `INSERT INTO \`${tableName}\` VALUES ${values.join(', ')};\n`;
        }
        sqlContent += `\n`;
      }
    }

    sqlContent += `SET FOREIGN_KEY_CHECKS = 1;\n`;

    fs.writeFileSync(LATEST_FILE, sqlContent);
    console.log(`备份成功！文件已保存至: ${LATEST_FILE}`);
    console.log(`提示: 此文件 (latest.sql) 为当前数据库的实时快照。`);
    console.log(`若需更新固定初始数据，请手动将其复制/重命名为 init.sql。`);

  } catch (error: any) {
    console.error('生成失败:', error);
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

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

// 加载环境变量
dotenv.config({ path: path.join(process.cwd(), '.env') });

const OUTPUT_DIR = path.join(process.cwd(), 'scripts', 'database', 'mongodb', 'data');
const LATEST_FILE = path.join(OUTPUT_DIR, 'latest.json');

async function main() {
  console.log('开始生成 MongoDB 数据库备份 (Dump)...');
  console.log(`目标文件: ${LATEST_FILE}`);

  // 检查输出目录
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const host = process.env.MONGODB_HOST || 'localhost';
  const port = process.env.MONGODB_PORT || '27017';
  const dbName = process.env.MONGODB_DATABASE || 'ux_plus_nestjs';
  const user = process.env.MONGODB_USERNAME;
  const pass = process.env.MONGODB_PASSWORD;

  let uri = `mongodb://${host}:${port}/${dbName}`;
  if (user && pass) {
    uri = `mongodb://${user}:${pass}@${host}:${port}/${dbName}?authSource=admin`;
  }

  console.log(`连接到 MongoDB: ${host}:${port}/${dbName}`);

  try {
    await mongoose.connect(uri);
    
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error('Database connection failed');
    }

    const collections = await db.listCollections().toArray();
    const dumpData: any = {
      timestamp: new Date().toISOString(),
      collections: []
    };

    if (collections.length === 0) {
      console.warn('数据库中没有集合。');
    }

    for (const col of collections) {
      const colName = col.name;
      console.log(`处理集合: ${colName}`);
      
      const collection = db.collection(colName);
      
      // 获取索引
      const indexes = await collection.indexes();
      
      // 获取数据
      const documents = await collection.find({}).toArray();

      dumpData.collections.push({
        name: colName,
        indexes: indexes,
        data: documents
      });
    }

    // 保存为 JSON
    // 注意: MongoDB 的 BSON 类型 (如 ObjectId, Date) 在 JSON.stringify 中会丢失部分类型信息
    // 这里简单处理，如果需要严格还原可能需要使用 EJSON 库或自定义 replacer
    fs.writeFileSync(LATEST_FILE, JSON.stringify(dumpData, null, 2));
    
    console.log(`备份成功！文件已保存至: ${LATEST_FILE}`);
    console.log(`提示: 此文件 (latest.json) 为当前数据库的实时快照。`);
    console.log(`若需更新固定初始数据，请手动将其复制/重命名为 init.json。`);
    
  } catch (error: any) {
    console.error('生成失败:', error);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

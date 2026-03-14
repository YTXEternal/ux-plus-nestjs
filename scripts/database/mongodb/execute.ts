import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

// 加载环境变量
dotenv.config({ path: path.join(process.cwd(), '.env') });

const DATA_DIR = path.join(
  process.cwd(),
  'scripts',
  'database',
  'mongodb',
  'data',
);

async function main() {
  // 解析命令行参数
  const args = process.argv.slice(2);
  let type = 'init'; // 默认

  args.forEach((arg) => {
    if (arg.startsWith('--type=')) {
      type = arg.split('=')[1];
    }
  });

  if (type !== 'init' && type !== 'latest') {
    console.error(`无效的类型参数: ${type}。请使用 'init' 或 'latest'。`);
    process.exit(1);
  }

  const jsonFile = path.join(DATA_DIR, `${type}.json`);
  console.log(`准备执行 MongoDB 初始化脚本...`);
  console.log(`使用数据源: ${type} (${jsonFile})`);

  if (!fs.existsSync(jsonFile)) {
    if (type === 'init') {
      console.error(`错误: 未找到固定初始数据文件 (init.json)。`);
      console.error(
        `请手动提供该文件，或将 'latest.json' 复制为 'init.json'。`,
      );
    } else {
      console.error(`错误: 未找到文件 ${jsonFile}`);
      console.error(`请先运行 generate 脚本生成 latest.json。`);
    }
    process.exit(1);
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

    const dumpData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));

    if (!dumpData.collections || !Array.isArray(dumpData.collections)) {
      throw new Error('无效的备份文件格式：缺少 collections 数组');
    }

    for (const colConfig of dumpData.collections) {
      const colName = colConfig.name;
      console.log(`正在恢复集合: ${colName}`);

      // 1. 检查并创建/清空集合
      const existingCollections = await db
        .listCollections({ name: colName })
        .toArray();
      if (existingCollections.length > 0) {
        console.log(`  清理现有数据...`);
        await db.collection(colName).deleteMany({});
      } else {
        await db.createCollection(colName);
      }

      const collection = db.collection(colName);

      // 2. 恢复索引 (跳过 _id 索引，它是自动创建的)
      if (colConfig.indexes && colConfig.indexes.length > 0) {
        for (const idx of colConfig.indexes) {
          if (idx.name === '_id_') continue;
          try {
            // 移除 ns 字段和 v 字段，这些是内部字段
            const { ns, v, ...indexOptions } = idx;
            await collection.createIndex(indexOptions.key, indexOptions);
            console.log(`  创建索引: ${indexOptions.name}`);
          } catch (e: any) {
            console.warn(`  索引创建失败 (${idx.name}): ${e.message}`);
          }
        }
      }

      // 3. 恢复数据
      if (colConfig.data && colConfig.data.length > 0) {
        // 需要处理特殊类型，例如 _id 可能是 hex string 需要转为 ObjectId (如果使用了 EJSON 则需要解析，这里简化处理)
        // 注意：mongoose 在 insertMany 时会自动处理部分类型，但如果是原生 driver 需要注意
        // 简单脚本暂时直接插入，如果遇到 _id 冲突会报错 (但前面已经清空了)

        try {
          await collection.insertMany(colConfig.data);
          console.log(`  插入 ${colConfig.data.length} 条文档。`);
        } catch (e: any) {
          console.error(`  插入数据失败: ${e.message}`);
        }
      }
    }

    console.log('MongoDB 初始化完成！');
  } catch (error: any) {
    console.error('执行失败:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

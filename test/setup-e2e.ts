import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as path from 'path';

async function setup() {
  console.log('Setting up test database...');

  // Load .env.test manually
  dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

  const host = process.env.MYSQL_HOST || 'localhost';
  const port = parseInt(process.env.MYSQL_PORT || '3306');
  const user = process.env.MYSQL_USERNAME || 'root';
  const password = process.env.MYSQL_PASSWORD || '123456';
  const database = process.env.MYSQL_DATABASE || 'platform_test';

  console.log(`Connecting to MySQL at ${host}:${port} as ${user}...`);

  try {
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
    });

    console.log(`Creating database ${database} if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    console.log('Database created successfully.');
    await connection.end();
  } catch (error) {
    console.error('Error creating test database:', error);
    process.exit(1);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
setup();

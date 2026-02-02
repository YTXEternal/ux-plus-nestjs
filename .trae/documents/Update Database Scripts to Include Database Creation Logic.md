I will modify the MySQL scripts to include database creation logic in the generated SQL file and update the execution script to handle database creation properly.

### MySQL Changes
1.  **`scripts/database/mysql/generate.ts`**:
    *   Update the script to inject `CREATE DATABASE IF NOT EXISTS \`${database}\`;` and `USE \`${database}\`;` at the beginning of the generated SQL file.
    *   This ensures that when the SQL is executed, it automatically creates (if missing) and selects the correct database.

2.  **`scripts/database/mysql/execute.ts`**:
    *   Update the connection configuration to **omit** the `database` parameter during the initial connection.
    *   This allows the script to connect to the MySQL server even if the target database does not exist yet.
    *   The script will then execute the SQL file (which now contains the `CREATE DATABASE` and `USE` statements), effectively creating the database and populating it.

### MongoDB Context
*   For MongoDB, the database is created automatically when data is written to it.
*   The current `scripts/database/mongodb/execute.ts` already constructs the connection URI using `process.env.MONGODB_DATABASE` (e.g., `mongodb://localhost:27017/platform`).
*   When `mongoose.connect(uri)` is called and data is inserted, MongoDB creates the `platform` database if it doesn't exist.
*   Therefore, **no changes are strictly required for MongoDB** to support "database creation", as it's implicit in the driver's behavior. However, I will review the script to ensure it logs this behavior clearly.

I will proceed with modifying the MySQL scripts.
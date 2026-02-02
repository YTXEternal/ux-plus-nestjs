I will reorganize the scripts and implement the database management logic as requested.

### 1. Directory Structure
I will create the following structure under the root `scripts/` directory:
```
scripts/
  ├── database/
  │   ├── mysql/
  │   │   ├── generate.ts      (Dumps current DB to file)
  │   │   ├── execute.ts       (Restores DB from file)
  │   │   └── data/            (Stores .sql files)
  │   │       ├── init.sql     (Fixed initial data)
  │   │       └── latest.sql   (Real-time generated data)
  │   └── mongodb/
  │       ├── generate.ts      (Dumps current Mongo to file)
  │       ├── execute.ts       (Restores Mongo from file)
  │       └── data/            (Stores .json files)
  │           ├── init.json    (Fixed initial data)
  │           └── latest.json  (Real-time generated data)
```

### 2. MySQL Scripts Implementation
*   **`generate.ts`**: 
    *   Connects to the database using `mysql2`.
    *   Retrieves all tables using `SHOW TABLES`.
    *   For each table, gets structure via `SHOW CREATE TABLE`.
    *   For each table, gets all data via `SELECT *`.
    *   Generates a complete SQL script (with `DROP`, `CREATE`, `INSERT`).
    *   Saves to `scripts/database/mysql/data/latest.sql`.
    *   **Note**: You can manually copy `latest.sql` to `init.sql` to set the "Fixed" baseline.
*   **`execute.ts`**:
    *   Accepts a command-line argument `type` (values: `init` or `latest`, default: `init`).
    *   Reads the corresponding SQL file.
    *   Executes the SQL statements against the configured database.

### 3. MongoDB Scripts Implementation
*   **`generate.ts`**:
    *   Connects using `mongoose`.
    *   Lists all collections.
    *   For each collection, retrieves indexes and all documents.
    *   Serializes the data (handling special types like `ObjectId` where possible/necessary for restoration).
    *   Saves to `scripts/database/mongodb/data/latest.json`.
*   **`execute.ts`**:
    *   Accepts `type` argument (`init` or `latest`).
    *   Reads the JSON file.
    *   Drops existing collections (to ensure clean state).
    *   Recreates collections, indexes, and inserts documents.

### 4. Cleanup
*   I will delete the previously created `script/` directory to avoid confusion.

### 5. Execution
I will write these 4 TypeScript files and create the necessary folders.
You will be able to run them via:
`npx ts-node scripts/database/mysql/generate.ts`
`npx ts-node scripts/database/mysql/execute.ts --type=latest`
I will create four TypeScript scripts in the `script` directory to handle the generation and execution of database structures and initial data for MySQL and MongoDB, as requested.

### MySQL Scripts
1.  **`script/mysql-generate.ts`**
    *   **Function**: Reads the `SYSTEM_MODULES_DESIGN.md` file (which contains the authoritative SQL definitions and initial data).
    *   **Logic**: Parses the file to extract `CREATE TABLE`, `DROP TABLE`, and `INSERT INTO` statements.
    *   **Output**: Generates a `script/mysql-init.sql` file containing the complete SQL script for structure and initial data.
    *   **Reasoning**: The design document already contains the fixed structure and data (Admin user, Menus, Roles, etc.), ensuring the script matches the documented system design.

2.  **`script/mysql-execute.ts`**
    *   **Function**: Executes the generated SQL against the MySQL database.
    *   **Logic**:
        *   Loads environment variables (host, user, password, database) using `dotenv`.
        *   Reads `script/mysql-init.sql`.
        *   Connects to the database using `mysql2`.
        *   Executes the SQL statements sequentially.

### MongoDB Scripts
3.  **`script/mongodb-generate.ts`**
    *   **Function**: Generates a MongoDB initialization script.
    *   **Logic**: Since the codebase currently only contains a `CatSchema` (class `List`), this script will generate a `script/mongo-init.js` file that defines the collection creation and any necessary indexes.
    *   **Output**: `script/mongo-init.js` containing the MongoDB setup commands.

4.  **`script/mongodb-execute.ts`**
    *   **Function**: Applies the MongoDB initialization.
    *   **Logic**:
        *   Loads environment variables.
        *   Connects to MongoDB using `mongoose`.
        *   Executes the logic defined in `script/mongo-init.js` (creating collections/indexes).

### Technical Details
*   **Location**: All scripts will be placed in `script/` at the project root.
*   **Format**: TypeScript (`.ts`), using ES6 module syntax (`import`/`export`).
*   **Execution**: Designed to be run via `npx ts-node script/<script-name>.ts`.
*   **Dependencies**: Will use existing project dependencies (`mysql2`, `mongoose`, `dotenv`, `fs`).

I will proceed with creating these files.
I will modify the scripts to align strictly with your new requirements.

### MySQL Changes
1.  **`scripts/database/mysql/generate.ts`**:
    *   **Remove `--init` logic completely**.
    *   The script will *always* generate `latest.sql` from the current database.
    *   It will *not* touch or create `init.sql`.

2.  **`scripts/database/mysql/execute.ts`**:
    *   Keep default behavior: if no `--type` is provided, default to `type = 'init'`.
    *   If `type === 'init'`, check for `init.sql`.
    *   **New Logic**: If `init.sql` does not exist, print a clear error message: "Fixed initial data file (init.sql) not found. Please provide it manually." and exit.
    *   If `type === 'latest'`, execute `latest.sql`.

### MongoDB Changes
3.  **`scripts/database/mongodb/generate.ts`**:
    *   **Remove `--init` logic completely**.
    *   Always generate `latest.json`.

4.  **`scripts/database/mongodb/execute.ts`**:
    *   Same logic as MySQL: default to `init`, error if `init.json` is missing.

### Summary
*   **Generate**: Always creates `latest.*` (Snapshot).
*   **Execute (default)**: Tries to run `init.*` (Fixed Base), errors if missing.
*   **Execute (`--type=latest`)**: Runs `latest.*` (Snapshot).

I will proceed with these modifications.
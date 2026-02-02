I will update both the MySQL and MongoDB generation scripts to support an `--init` flag.

### MySQL Script (`scripts/database/mysql/generate.ts`)
*   **Logic Change**:
    *   Parse command-line arguments to check for `--init`.
    *   If `--init` is present, set the output filename to `init.sql`.
    *   If `--init` is NOT present (default), keep the output filename as `latest.sql`.
*   **Outcome**: Running `pnpm mysql:generate --init` will save the current database state directly to `init.sql`, serving as the "fixed initial data" as requested.

### MongoDB Script (`scripts/database/mongodb/generate.ts`)
*   **Logic Change**:
    *   Parse command-line arguments to check for `--init`.
    *   If `--init` is present, set the output filename to `init.json`.
    *   If `--init` is NOT present, keep the output filename as `latest.json`.
*   **Outcome**: Running `pnpm mongo:generate --init` will save the current MongoDB state to `init.json`.

This change simplifies the workflow by allowing the user to directly generate the fixed initial data file without manual copying/renaming.

I will implement these changes now.
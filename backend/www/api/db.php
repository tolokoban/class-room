<?php

require_once __DIR__ . "/env.php";

class Database
{
    private PDO $pdo;
    private bool $debug;

    public function __construct(string $host, string $name, string $user, string $password, bool $debug = false)
    {
        $this->debug = $debug;
        $dsn = "mysql:host={$host};dbname={$name};charset=utf8mb4";
        try {
            $this->pdo = new PDO($dsn, $user, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_PERSISTENT => true,
            ]);
        } catch (PDOException $exception) {
            $this->logException($exception);
            throw $exception;
        }
    }

    /**
     * Use this function when writing a SQL statement that references a table.
     * It will automatically add the prefix defined in `env.php`.
     */
    public function table(string $name): string
    {
        global $DB_PRFX;
        return $DB_PRFX . $name;
    }

    /**
     * Return the last autoincremented index.
     */
    public function lastId(): string
    {
        return $this->pdo->lastInsertId();
    }

    /**
     * Prepare a SQL query with parameters.
     */
    private function prepare(string $query): PDOStatement
    {
        try {
            return $this->pdo->prepare($query);
        } catch (PDOException $exception) {
            $this->logException($exception);
            throw $exception;
        }
    }

    /**
     * Start a transaction.
     */
    public function begin(): bool
    {
        return $this->pdo->beginTransaction();
    }

    /**
     * Commit the current transaction.
     */
    public function commit(): bool
    {
        return $this->pdo->commit();
    }

    /**
     * Rollback the current transaction.
     */
    public function rollback(): bool
    {
        return $this->pdo->rollBack();
    }

    /**
     * Execute a SQL query with an arbitrary number of parameters.
     *
     * The first argument is the SQL query (which can contain `?`
     * placeholders), the rest of the arguments are the parameters bound to
     * those placeholders.
     *
     * @return PDOStatement|false The executed statement (use `fetch()` /
     * `fetchAll()` on it to read `SELECT` results), or `false` if the
     * query could not be executed.
     * @throws Exception if no query is provided or if the query fails.
     */
    public function query(): PDOStatement|false
    {
        $args = func_get_args();
        if (count($args) < 1) {
            throw new Exception("Database::query() expects at least one argument (the SQL query)!");
        }
        $query = array_shift($args);
        $params = $args;

        if ($this->debug) {
            error_log("[Database::query] {$query}");
            error_log("[Database::query] Params: " . json_encode($params));
        }

        try {
            $stmt = $this->prepare($query);
            if (!$stmt->execute($params)) {
                return false;
            }
            return $stmt;
        } catch (PDOException $exception) {
            $this->logException($exception);
            throw $exception;
        }
    }

    /**
     * Create the tables of `structure.sql` that do not exist yet in the database.
     * If the database was empty, it is also filled with `data.sql`.
     *
     * This way, a table added to `structure.sql` is automatically created
     * in an existing database (with the `ALTER TABLE` statements about it).
     *
     * The SQL files use the `classroom_` prefix, which is replaced by
     * the one defined in `env.php`.
     */
    public function ensureStructure(string $sqlDir): void
    {
        $statements = $this->readStatements("{$sqlDir}/structure.sql");
        if (count($this->getMissingTables($statements)) === 0) {
            return;
        }

        // Prevent two simultaneous requests from creating the tables twice.
        $lockName = $this->table("structure");
        $this->query("SELECT GET_LOCK(?, 30)", $lockName);
        try {
            $missing = $this->getMissingTables($statements);
            if (count($missing) === 0) {
                return;
            }
            error_log("[Database] Creating missing tables: " . implode(", ", $missing));
            foreach ($statements as $statement) {
                if (in_array($this->getStatementTable($statement), $missing, true)) {
                    $this->query($statement);
                }
            }
            if (in_array($this->table("user"), $missing, true)) {
                error_log("[Database] Filling the new database...");
                foreach ($this->readStatements("{$sqlDir}/data.sql") as $statement) {
                    $this->query($statement);
                }
            }
        } finally {
            $this->query("SELECT RELEASE_LOCK(?)", $lockName);
        }
    }

    /**
     * @param string[] $statements
     * @return string[] Names (with prefix) of the tables created or altered
     * by these statements, but which do not exist in the database.
     */
    private function getMissingTables(array $statements): array
    {
        $stmt = $this->query(
            "SELECT `table_name` AS `name` FROM information_schema.tables WHERE table_schema = DATABASE()"
        );
        $existing = $stmt === false ? [] : array_column($stmt->fetchAll(), "name");
        $wanted = array_unique(array_filter(array_map(
            fn($statement) => $this->getStatementTable($statement),
            $statements
        )));
        return array_values(array_diff($wanted, $existing));
    }

    /**
     * @return string|null The name of the table of a `CREATE TABLE` or `ALTER TABLE` statement.
     */
    private function getStatementTable(string $statement): ?string
    {
        return preg_match('/^\s*(?:CREATE|ALTER)\s+TABLE\s+`([^`]+)`/i', $statement, $matches)
            ? $matches[1]
            : null;
    }

    /**
     * Read every statement of a SQL file, with the table prefix of `env.php`.
     * Statements are expected to end with a `;` at the end of a line.
     *
     * @return string[]
     */
    private function readStatements(string $path): array
    {
        $sql = file_get_contents($path);
        if ($sql === false) {
            throw new Exception("Unable to read SQL file: {$path}");
        }
        // Remove comment lines.
        $sql = preg_replace('/^\s*--.*$/m', "", $sql);
        $sql = str_replace("`classroom_", "`" . $this->table(""), $sql);
        return array_values(array_filter(
            preg_split('/;\s*$/m', $sql),
            fn($statement) => trim($statement) !== ""
        ));
    }

    private function logException(PDOException $exception): void
    {
        if ($this->debug) {
            error_log("[Database] " . $exception->getMessage());
        }
    }
}

// Prevent reconnecting to the database if this file is included more than once.
if (!isset($GLOBALS["DB"])) {
    global $DB_HOST, $DB_NAME, $DB_USER, $DB_PWRD, $DB_DBUG;
    $GLOBALS["DB"] = new Database($DB_HOST, $DB_NAME, $DB_USER, $DB_PWRD, $DB_DBUG ?? false);
    // Copies of `backend/database/sql/*.sql` (see docker-compose.yaml and scripts/deploy.mjs).
    $GLOBALS["DB"]->ensureStructure(__DIR__ . "/sql");
}
$DB = $GLOBALS["DB"];

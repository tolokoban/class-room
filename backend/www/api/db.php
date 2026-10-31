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
     * Create the tables (`structure.sql`) and fill them (`data.sql`)
     * if they do not exist yet in the database.
     *
     * The SQL files use the `classroom_` prefix, which is replaced by
     * the one defined in `env.php`.
     */
    public function ensureStructure(string $sqlDir): void
    {
        if ($this->hasTable("user")) {
            return;
        }

        // Prevent two simultaneous requests from creating the tables twice.
        $lockName = $this->table("structure");
        $this->query("SELECT GET_LOCK(?, 30)", $lockName);
        try {
            if ($this->hasTable("user")) {
                return;
            }
            error_log("[Database] Creating the database structure...");
            foreach (["structure.sql", "data.sql"] as $filename) {
                $this->executeFile("{$sqlDir}/{$filename}");
            }
        } finally {
            $this->query("SELECT RELEASE_LOCK(?)", $lockName);
        }
    }

    private function hasTable(string $name): bool
    {
        $stmt = $this->query(
            "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?",
            $this->table($name)
        );
        return $stmt !== false && (int) $stmt->fetchColumn() > 0;
    }

    /**
     * Execute every statement of a SQL file, one by one.
     * Statements are expected to end with a `;` at the end of a line.
     */
    private function executeFile(string $path): void
    {
        $sql = file_get_contents($path);
        if ($sql === false) {
            throw new Exception("Unable to read SQL file: {$path}");
        }
        // Remove comment lines.
        $sql = preg_replace('/^\s*--.*$/m', "", $sql);
        $sql = str_replace("`classroom_", "`" . $this->table(""), $sql);
        foreach (preg_split('/;\s*$/m', $sql) as $statement) {
            if (trim($statement) !== "") {
                $this->query($statement);
            }
        }
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

<?php
require_once __DIR__ . "/../../../db.php";

$ROLE = "teacher";

/**
 * List all the class rooms of the current user, sorted by name.
 *
 * @param null $input Ignored.
 * @return mixed
 * ```ts
 * Array<{
 *   id: number
 *   code: string
 *   name: string
 *   description: string
 * }>
 * ```
 */
function entrypoint($input)
{
    global $DB;

    $user = $_SESSION["USER"];
    $stmt = $DB->query(
        "SELECT `id`, `code`, `name`, `description` FROM `{$DB->table("class")}`
         WHERE `user` = ? ORDER BY `name`",
        $user["id"]
    );
    $rows = $stmt === false ? [] : $stmt->fetchAll();

    return array_map(fn($row) => [
        "id" => (int) $row["id"],
        "code" => $row["code"],
        "name" => $row["name"],
        "description" => $row["description"],
    ], $rows);
}

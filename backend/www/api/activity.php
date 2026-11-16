<?php

require_once __DIR__ . "/db.php";

/**
 * Find a class room (table `class`) from its `code`.
 *
 * @return array|false `["id" => int, "user" => int, "activity" => string|null, "maxStudents" => int]`,
 * or `false` if there is no class room with this code.
 */
function findClassByCode(string $code)
{
    global $DB;

    $stmt = $DB->query(
        "SELECT `id`, `user`, `activity`, `max_students` FROM `{$DB->table("class")}` WHERE `code` = ?",
        $code
    );
    $row = $stmt === false ? false : $stmt->fetch();
    if ($row === false) {
        return false;
    }

    return [
        "id" => (int) $row["id"],
        "user" => (int) $row["user"],
        "activity" => $row["activity"],
        "maxStudents" => (int) $row["max_students"],
    ];
}

/**
 * Is `$value` a non empty string (once trimmed)?
 */
function isNonEmptyString($value): bool
{
    return is_string($value) && trim($value) !== "";
}

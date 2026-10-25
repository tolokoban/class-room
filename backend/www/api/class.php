<?php

require_once __DIR__ . "/db.php";

/**
 * Check if a class `code` is already used by another class room.
 *
 * @param int|null $exceptId ID of a class to ignore (the one being updated).
 */
function isClassCodeUsed(string $code, ?int $exceptId = null): bool
{
    global $DB;

    $stmt = $DB->query(
        "SELECT `id` FROM `{$DB->table("class")}` WHERE `code` = ? AND `id` <> ?",
        $code,
        $exceptId ?? 0
    );
    return $stmt !== false && $stmt->fetch() !== false;
}

/**
 * Is this `PDOException` caused by a duplicate entry on a UNIQUE key?
 */
function isDuplicateKeyError(Exception $exception): bool
{
    return $exception instanceof PDOException
        && ($exception->errorInfo[1] ?? null) === 1062;
}

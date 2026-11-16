<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../activity.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "teacher";

/**
 * Free the seat of a student (or of all the students) of a class room owned by the current user.
 * The disconnected students go back to the login page, and their nickname can be used again.
 * Their uploaded files are kept: they belong to their computer.
 *
 * @param mixed $input
 * ```ts
 * {
 *   classroomCode: string // Field `code` of table `class`.
 *   // Nickname of the student to disconnect. If missing, all the students are disconnected.
 *   nickname?: string
 * }
 * ```
 * @return int Number of freed seats. Or an error code:
 * * -40501: Invalid input.
 * * -40502: There is no class room with this code.
 * * -40503: You are not the owner of this class room.
 * * -40504: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $classroomCode = $input["classroomCode"] ?? null;
    $nickname = $input["nickname"] ?? null;
    if (!isNonEmptyString($classroomCode) || ($nickname !== null && !is_string($nickname))) {
        error_log("[room/kick] Invalid input.");
        return -40501;
    }

    $class = findOwnedClass($classroomCode);
    if ($class === "missing") {
        error_log("[room/kick] Class room \"$classroomCode\" does not exist.");
        return -40502;
    }
    if ($class === "forbidden") {
        error_log("[room/kick] You are not the owner of class room \"$classroomCode\".");
        return -40503;
    }

    try {
        $stmt = $nickname === null
            ? $DB->query("DELETE FROM `{$DB->table("seat")}` WHERE `classroom` = ?", $class["id"])
            : $DB->query(
                "DELETE FROM `{$DB->table("seat")}` WHERE `classroom` = ? AND `nickname` = ?",
                $class["id"],
                $nickname
            );
    } catch (Exception $exception) {
        error_log("[room/kick] Database error: " . $exception->getMessage());
        return -40504;
    }
    if ($stmt === false) {
        return -40504;
    }

    return $stmt->rowCount();
}

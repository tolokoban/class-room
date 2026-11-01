<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../activity.php";

$ROLE = "teacher";

/**
 * Get the nicknames of all the students currently in a class room
 * owned by the current user.
 *
 * @param mixed $input
 * ```ts
 * {
 *   classroomCode: string // Field `code` of table `class`.
 * }
 * ```
 * @return mixed In case of success, the sorted list of the nicknames (`string[]`).
 * Otherwise:
 * * -40201: Invalid input.
 * * -40202: There is no class room with this code.
 * * -40203: You are not the owner of this class room.
 */
function entrypoint($input)
{
    global $DB;

    $classroomCode = $input["classroomCode"] ?? null;

    if (!isNonEmptyString($classroomCode)) {
        error_log("[room/students] Invalid input.");
        return -40201;
    }

    $class = findClassByCode($classroomCode);
    if ($class === false) {
        error_log("[room/students] Class room \"$classroomCode\" does not exist.");
        return -40202;
    }

    $user = $_SESSION["USER"];
    if ($class["user"] !== $user["id"]) {
        error_log("[room/students] User \"{$user["login"]}\" is not the owner of class room \"$classroomCode\".");
        return -40203;
    }

    $stmt = $DB->query(
        "SELECT DISTINCT `nickname` FROM `{$DB->table("room")}`
         WHERE `classroom` = ? ORDER BY `nickname`",
        $class["id"]
    );
    $rows = $stmt === false ? [] : $stmt->fetchAll();

    return array_map(fn($row) => $row["nickname"], $rows);
}

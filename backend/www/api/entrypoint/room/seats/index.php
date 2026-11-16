<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../activity.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "teacher";

/**
 * List the seats of a class room owned by the current user.
 *
 * @param mixed $input
 * ```ts
 * {
 *   classroomCode: string // Field `code` of table `class`.
 * }
 * ```
 * @return mixed In case of success:
 * ```ts
 * {
 *   maxStudents: number
 *   // Current UNIX timestamp of the server (seconds).
 *   now: number
 *   // Sorted by nickname.
 *   seats: Array<{
 *     nickname: string
 *     // UNIX timestamp (seconds) of the last time the student has been seen.
 *     time: number
 *     // Number of files uploaded by this student in the written productions of this class room.
 *     uploads: number
 *   }>
 * }
 * ```
 * Otherwise:
 * * -40401: Invalid input.
 * * -40402: There is no class room with this code.
 * * -40403: You are not the owner of this class room.
 */
function entrypoint($input)
{
    global $DB;

    $classroomCode = $input["classroomCode"] ?? null;
    if (!isNonEmptyString($classroomCode)) {
        error_log("[room/seats] Invalid input.");
        return -40401;
    }

    $class = findOwnedClass($classroomCode);
    if ($class === "missing") {
        error_log("[room/seats] Class room \"$classroomCode\" does not exist.");
        return -40402;
    }
    if ($class === "forbidden") {
        error_log("[room/seats] You are not the owner of class room \"$classroomCode\".");
        return -40403;
    }

    $stmt = $DB->query(
        "SELECT `s`.`nickname`, UNIX_TIMESTAMP(`s`.`time`) AS `time`,
            (SELECT COUNT(*) FROM `{$DB->table("written_upload")}` AS `u`
             JOIN `{$DB->table("written_assignment")}` AS `a` ON `a`.`id` = `u`.`assignment`
             WHERE `a`.`classroom` = `s`.`classroom` AND `u`.`computer` = `s`.`computer` AND `u`.`complete` = 1
            ) AS `uploads`
         FROM `{$DB->table("seat")}` AS `s`
         WHERE `s`.`classroom` = ? ORDER BY `s`.`nickname`",
        $class["id"]
    );
    $rows = $stmt === false ? [] : $stmt->fetchAll();

    return [
        "maxStudents" => $class["maxStudents"],
        "now" => time(),
        "seats" => array_map(fn($row) => [
            "nickname" => $row["nickname"],
            "time" => (int) $row["time"],
            "uploads" => (int) $row["uploads"],
        ], $rows),
    ];
}

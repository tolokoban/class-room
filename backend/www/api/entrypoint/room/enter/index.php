<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../activity.php";

$ROLE = "";

/**
 * Remember that a student has just entered a class room.
 * A student (identified by its `computer`) is only in one class room at a time:
 * the previous one is forgotten.
 *
 * @param mixed $input
 * ```ts
 * {
 *   classroomCode: string // Field `code` of table `class`.
 *   computer: string // Unique identifier of the student's computer.
 *   nickname: string // Student's nickname.
 * }
 * ```
 * @return int
 * * 0: Success.
 * * -40101: Invalid input.
 * * -40102: There is no class room with this code.
 * * -40103: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $classroomCode = $input["classroomCode"] ?? null;
    $computer = $input["computer"] ?? null;
    $nickname = $input["nickname"] ?? null;

    if (
        !isNonEmptyString($classroomCode)
        || !isNonEmptyString($computer)
        || !isNonEmptyString($nickname)
    ) {
        error_log("[room/enter] Invalid input.");
        return -40101;
    }
    $nickname = trim($nickname);

    $class = findClassByCode($classroomCode);
    if ($class === false) {
        error_log("[room/enter] Class room \"$classroomCode\" does not exist.");
        return -40102;
    }

    try {
        $stmt = $DB->query(
            "INSERT INTO `{$DB->table("room")}` (`computer`, `nickname`, `classroom`, `time`)
             VALUES (?, ?, ?, NOW())
             ON DUPLICATE KEY UPDATE
                `nickname` = VALUES(`nickname`),
                `classroom` = VALUES(`classroom`),
                `time` = VALUES(`time`)",
            $computer,
            $nickname,
            $class["id"]
        );
    } catch (Exception $exception) {
        error_log("[room/enter] Database error: " . $exception->getMessage());
        return -40103;
    }

    if ($stmt === false) {
        error_log("[room/enter] Failed to store the room of \"$nickname\".");
        return -40103;
    }

    return 0;
}

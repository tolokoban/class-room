<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../activity.php";

$ROLE = "";

/**
 * Get the result a student stored for an activity of a class room
 * (see `activity/result-set`). Only the computer that stored the result can read it:
 * this prevents a student from reading the result of another one.
 *
 * @param mixed $input
 * ```ts
 * {
 *   classroomCode: string // Field `code` of table `class`.
 *   activityCode: string
 *   computer: string // Unique identifier of the student's computer.
 *   nickname: string // Student's nickname.
 * }
 * ```
 * @return mixed The stored result (a string), or `null` if there is none yet.
 * Otherwise:
 * * -30601: Invalid input.
 * * -30602: There is no class room with this code.
 * * -30603: This nickname is already used on another computer.
 * * -30604: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $classroomCode = $input["classroomCode"] ?? null;
    $activityCode = $input["activityCode"] ?? null;
    $computer = $input["computer"] ?? null;
    $nickname = $input["nickname"] ?? null;

    if (
        !isNonEmptyString($classroomCode)
        || !isNonEmptyString($activityCode)
        || !isNonEmptyString($computer)
        || !isNonEmptyString($nickname)
    ) {
        error_log("[activity/result-get] Invalid input.");
        return -30601;
    }
    $nickname = trim($nickname);

    $class = findClassByCode($classroomCode);
    if ($class === false) {
        error_log("[activity/result-get] Class room \"$classroomCode\" does not exist.");
        return -30602;
    }

    try {
        $stmt = $DB->query(
            "SELECT `computer`, `result` FROM `{$DB->table("activity")}`
             WHERE `classroom` = ? AND `code` = ? AND `nickname` = ?",
            $class["id"],
            $activityCode,
            $nickname
        );
    } catch (Exception $exception) {
        error_log("[activity/result-get] Database error: " . $exception->getMessage());
        return -30604;
    }
    if ($stmt === false) {
        error_log("[activity/result-get] Failed to read the result.");
        return -30604;
    }

    $row = $stmt->fetch();
    if ($row === false) {
        return null;
    }
    if ($row["computer"] !== $computer) {
        error_log("[activity/result-get] Nickname \"$nickname\" is already used on another computer.");
        return -30603;
    }

    return $row["result"];
}

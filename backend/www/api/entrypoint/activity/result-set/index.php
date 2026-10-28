<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../activity.php";

$ROLE = "";

/**
 * Store the result of a student for an activity of a class room.
 * If this student (same `nickname`) already has a result for this activity,
 * it is replaced. But only if it comes from the same `computer`: this prevents
 * a student from overwriting the result of another one.
 *
 * @param mixed $input
 * ```ts
 * {
 *   classroomCode: string // Field `code` of table `class`.
 *   activityCode: string
 *   computer: string // Unique identifier of the student's computer.
 *   nickname: string // Student's nickname.
 *   result: string
 * }
 * ```
 * @return int
 * * 0: Result stored.
 * * -30101: Invalid input.
 * * -30102: There is no class room with this code.
 * * -30103: This nickname is already used on another computer.
 * * -30104: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $classroomCode = $input["classroomCode"] ?? null;
    $activityCode = $input["activityCode"] ?? null;
    $computer = $input["computer"] ?? null;
    $nickname = $input["nickname"] ?? null;
    $result = $input["result"] ?? null;

    if (
        !isNonEmptyString($classroomCode)
        || !isNonEmptyString($activityCode)
        || !isNonEmptyString($computer)
        || !isNonEmptyString($nickname)
        || !is_string($result)
    ) {
        error_log("[activity/result-set] Invalid input.");
        return -30101;
    }
    $nickname = trim($nickname);

    $class = findClassByCode($classroomCode);
    if ($class === false) {
        error_log("[activity/result-set] Class room \"$classroomCode\" does not exist.");
        return -30102;
    }

    try {
        $stmt = $DB->query(
            "SELECT `id`, `computer` FROM `{$DB->table("activity")}`
             WHERE `classroom` = ? AND `code` = ? AND `nickname` = ?",
            $class["id"],
            $activityCode,
            $nickname
        );
        $row = $stmt === false ? false : $stmt->fetch();
        if ($row === false) {
            $stmt = $DB->query(
                "INSERT INTO `{$DB->table("activity")}` (`classroom`, `code`, `computer`, `nickname`, `result`)
                 VALUES (?, ?, ?, ?, ?)",
                $class["id"],
                $activityCode,
                $computer,
                $nickname,
                $result
            );
        } else {
            if ($row["computer"] !== $computer) {
                error_log("[activity/result-set] Nickname \"$nickname\" is already used on another computer.");
                return -30103;
            }
            $stmt = $DB->query(
                "UPDATE `{$DB->table("activity")}` SET `result` = ? WHERE `id` = ?",
                $result,
                $row["id"]
            );
        }
    } catch (Exception $exception) {
        error_log("[activity/result-set] Database error: " . $exception->getMessage());
        return -30104;
    }

    if ($stmt === false) {
        error_log("[activity/result-set] Failed to store the result.");
        return -30104;
    }

    return 0;
}

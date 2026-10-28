<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../activity.php";

$ROLE = "teacher";

/**
 * Set the code of the activity the students of a class room owned by
 * the current user must display.
 *
 * @param mixed $input
 * ```ts
 * {
 *   classroomCode: string // Field `code` of table `class`.
 *   activityCode: string | null // `null` means "no current activity".
 * }
 * ```
 * @return int
 * * 0: Current activity updated.
 * * -30501: Invalid input.
 * * -30502: There is no class room with this code.
 * * -30503: You are not the owner of this class room.
 * * -30504: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $classroomCode = $input["classroomCode"] ?? null;
    $activityCode = $input["activityCode"] ?? null;

    if (
        !isNonEmptyString($classroomCode)
        || ($activityCode !== null && !isNonEmptyString($activityCode))
    ) {
        error_log("[activity/current-set] Invalid input.");
        return -30501;
    }

    $class = findClassByCode($classroomCode);
    if ($class === false) {
        error_log("[activity/current-set] Class room \"$classroomCode\" does not exist.");
        return -30502;
    }

    $user = $_SESSION["USER"];
    if ($class["user"] !== $user["id"]) {
        error_log("[activity/current-set] User \"{$user["login"]}\" is not the owner of class room \"$classroomCode\".");
        return -30503;
    }

    try {
        $stmt = $DB->query(
            "UPDATE `{$DB->table("class")}` SET `activity` = ? WHERE `id` = ?",
            $activityCode,
            $class["id"]
        );
    } catch (Exception $exception) {
        error_log("[activity/current-set] Database error: " . $exception->getMessage());
        return -30504;
    }

    if ($stmt === false) {
        error_log("[activity/current-set] Failed to update the current activity.");
        return -30504;
    }

    return 0;
}

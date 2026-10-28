<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../activity.php";

$ROLE = "teacher";

/**
 * Delete the results of an activity of a class room owned by the current user.
 * If `activityCode` is missing, the results of ALL the activities of this
 * class room are deleted.
 *
 * @param mixed $input
 * ```ts
 * {
 *   classroomCode: string // Field `code` of table `class`.
 *   activityCode?: string
 * }
 * ```
 * @return int
 * * 0: Deletion successful.
 * * -30301: Invalid input.
 * * -30302: There is no class room with this code.
 * * -30303: You are not the owner of this class room.
 * * -30304: Database error (reported in the logs).
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
        error_log("[activity/clear] Invalid input.");
        return -30301;
    }

    $class = findClassByCode($classroomCode);
    if ($class === false) {
        error_log("[activity/clear] Class room \"$classroomCode\" does not exist.");
        return -30302;
    }

    $user = $_SESSION["USER"];
    if ($class["user"] !== $user["id"]) {
        error_log("[activity/clear] User \"{$user["login"]}\" is not the owner of class room \"$classroomCode\".");
        return -30303;
    }

    try {
        if ($activityCode === null) {
            $stmt = $DB->query(
                "DELETE FROM `{$DB->table("activity")}` WHERE `classroom` = ?",
                $class["id"]
            );
        } else {
            $stmt = $DB->query(
                "DELETE FROM `{$DB->table("activity")}` WHERE `classroom` = ? AND `code` = ?",
                $class["id"],
                $activityCode
            );
        }
    } catch (Exception $exception) {
        error_log("[activity/clear] Database error: " . $exception->getMessage());
        return -30304;
    }

    if ($stmt === false) {
        error_log("[activity/clear] Failed to delete the results.");
        return -30304;
    }

    return 0;
}

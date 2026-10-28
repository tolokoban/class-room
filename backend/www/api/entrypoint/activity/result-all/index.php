<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../activity.php";

$ROLE = "teacher";

/**
 * Get the results of all the students for an activity of a class room
 * owned by the current user.
 *
 * @param mixed $input
 * ```ts
 * {
 *   classroomCode: string // Field `code` of table `class`.
 *   activityCode: string
 * }
 * ```
 * @return mixed In case of success, the results per student's nickname:
 * ```ts
 * { [nickname: string]: string }
 * ```
 * Otherwise:
 * * -30201: Invalid input.
 * * -30202: There is no class room with this code.
 * * -30203: You are not the owner of this class room.
 */
function entrypoint($input)
{
    global $DB;

    $classroomCode = $input["classroomCode"] ?? null;
    $activityCode = $input["activityCode"] ?? null;

    if (!isNonEmptyString($classroomCode) || !isNonEmptyString($activityCode)) {
        error_log("[activity/result-all] Invalid input.");
        return -30201;
    }

    $class = findClassByCode($classroomCode);
    if ($class === false) {
        error_log("[activity/result-all] Class room \"$classroomCode\" does not exist.");
        return -30202;
    }

    $user = $_SESSION["USER"];
    if ($class["user"] !== $user["id"]) {
        error_log("[activity/result-all] User \"{$user["login"]}\" is not the owner of class room \"$classroomCode\".");
        return -30203;
    }

    $stmt = $DB->query(
        "SELECT `nickname`, `result` FROM `{$DB->table("activity")}`
         WHERE `classroom` = ? AND `code` = ? ORDER BY `nickname`",
        $class["id"],
        $activityCode
    );
    $rows = $stmt === false ? [] : $stmt->fetchAll();

    $results = [];
    foreach ($rows as $row) {
        $results[$row["nickname"]] = $row["result"] ?? "";
    }
    // Force a JSON object, even when there is no result.
    return (object) $results;
}

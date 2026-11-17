<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../class.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "teacher";

/**
 * Assign a written production to a class room (both owned by the current user).
 * The timer of the new assignment is not started.
 * It is put at the end of the list of the class room.
 *
 * @param mixed $input
 * ```ts
 * {
 *   writtenId: number // Field `id` of table `written`.
 *   classroomCode: string // Field `code` of table `class`.
 * }
 * ```
 * @return int
 * * 0: Success.
 * * -60501: Invalid input.
 * * -60502: There is no class room with this code.
 * * -60503: You are not the owner of this class room.
 * * -60504: There is no written production with this ID.
 * * -60505: You are not the owner of this written production.
 * * -60506: This written production is already assigned to this class room.
 * * -60507: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $resolved = resolveAssignment($input["writtenId"] ?? null, $input["classroomCode"] ?? null, 60500, "written/assign");
    if (is_array($resolved)) {
        error_log("[written/assign] Written production #{$resolved["written"]["id"]} is already assigned.");
        return -60506;
    }
    if ($resolved !== -60506) {
        return $resolved;
    }

    $class = findClassByCode($input["classroomCode"]);
    try {
        $stmt = $DB->query(
            "INSERT INTO `{$DB->table("written_assignment")}` (`written`, `classroom`, `position`)
             SELECT ?, ?, COALESCE(MAX(`position`), 0) + 1
             FROM `{$DB->table("written_assignment")}` WHERE `classroom` = ?",
            $input["writtenId"],
            $class["id"],
            $class["id"]
        );
    } catch (Exception $exception) {
        if (isDuplicateKeyError($exception)) {
            return -60506;
        }
        error_log("[written/assign] Database error: " . $exception->getMessage());
        return -60507;
    }

    return $stmt === false ? -60507 : 0;
}

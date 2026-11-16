<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "teacher";

/**
 * Remove a written production from a class room, and delete the files uploaded for it
 * in this class room. If it was the current activity of the class room,
 * the class room has no current activity anymore.
 *
 * @param mixed $input
 * ```ts
 * {
 *   writtenId: number // Field `id` of table `written`.
 *   classroomCode: string // Field `code` of table `class`.
 * }
 * ```
 * @return int Number of deleted uploads. Or an error code:
 * * -60601: Invalid input.
 * * -60602: There is no class room with this code.
 * * -60603: You are not the owner of this class room.
 * * -60604: There is no written production with this ID.
 * * -60605: You are not the owner of this written production.
 * * -60606: This written production is not assigned to this class room.
 * * -60607: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $resolved = resolveAssignment($input["writtenId"] ?? null, $input["classroomCode"] ?? null, 60600, "written/unassign");
    if (is_int($resolved)) {
        return $resolved;
    }
    ["class" => $class, "written" => $written, "assignment" => $assignment] = $resolved;

    try {
        $deleted = deleteUploads("`a`.`id` = ?", $assignment["id"]);
        $DB->query("DELETE FROM `{$DB->table("written_assignment")}` WHERE `id` = ?", $assignment["id"]);
        $DB->query(
            "UPDATE `{$DB->table("class")}` SET `activity` = NULL WHERE `id` = ? AND `activity` = ?",
            $class["id"],
            WRITTEN_ACTIVITY_PREFIX . $written["id"]
        );
    } catch (Exception $exception) {
        error_log("[written/unassign] Database error: " . $exception->getMessage());
        return -60607;
    }

    return $deleted;
}

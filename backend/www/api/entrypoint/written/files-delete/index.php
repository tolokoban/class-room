<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "teacher";

/**
 * Delete the files uploaded by the students for a written production of a class room,
 * or for all the written productions of a class room (if `writtenId` is missing).
 *
 * @param mixed $input
 * ```ts
 * {
 *   classroomCode: string // Field `code` of table `class`.
 *   writtenId?: number // Field `id` of table `written`.
 * }
 * ```
 * @return int Number of deleted files. Or an error code:
 * * -61001: Invalid input.
 * * -61002: There is no class room with this code.
 * * -61003: You are not the owner of this class room.
 * * -61004: There is no written production with this ID.
 * * -61005: You are not the owner of this written production.
 * * -61006: This written production is not assigned to this class room.
 * * -61007: Database error (reported in the logs).
 */
function entrypoint($input)
{
    $writtenId = $input["writtenId"] ?? null;
    if ($writtenId === null) {
        $class = resolveOwnedClass($input["classroomCode"] ?? null, 61000, "written/files-delete");
        if (is_int($class)) {
            return $class;
        }
        $where = ["`a`.`classroom` = ?", $class["id"]];
    } else {
        $resolved = resolveAssignment($writtenId, $input["classroomCode"] ?? null, 61000, "written/files-delete");
        if (is_int($resolved)) {
            return $resolved;
        }
        $where = ["`a`.`id` = ?", $resolved["assignment"]["id"]];
    }

    try {
        return deleteUploads(...$where);
    } catch (Exception $exception) {
        error_log("[written/files-delete] Database error: " . $exception->getMessage());
        return -61007;
    }
}

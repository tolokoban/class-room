<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "";

/**
 * Delete the file uploaded by a student for an expected file (complete or not).
 *
 * @param mixed $input
 * ```ts
 * {
 *   writtenId: number // Field `id` of table `written`.
 *   classroomCode: string // Field `code` of table `class`.
 *   computer: string // Unique identifier of the student's computer.
 *   slot: string // Name of the expected file.
 * }
 * ```
 * @return int Number of deleted files. Or an error code:
 * * -61701: Invalid input.
 * * -61702: There is no class room with this code.
 * * -61703: This written production does not exist or is not assigned to this class room.
 * * -61704: You don't have a seat in this class room.
 * * -61705: Database error (reported in the logs).
 */
function entrypoint($input)
{
    $computer = $input["computer"] ?? null;
    $slot = $input["slot"] ?? null;
    if (!isNonEmptyString($computer) || !is_string($slot)) {
        error_log("[written/upload-delete] Invalid input.");
        return -61701;
    }
    $resolved = resolvePublicAssignment($input["writtenId"] ?? null, $input["classroomCode"] ?? null, 61700, "written/upload-delete");
    if (is_int($resolved)) {
        return $resolved;
    }
    ["class" => $class, "assignment" => $assignment] = $resolved;

    if (findSeat($class["id"], $computer) === false) {
        error_log("[written/upload-delete] This computer has no seat in class room #{$class["id"]}.");
        return -61704;
    }

    try {
        return deleteUploads(
            "`u`.`assignment` = ? AND `u`.`computer` = ? AND `u`.`slot` = ?",
            $assignment["id"],
            $computer,
            $slot
        );
    } catch (Exception $exception) {
        error_log("[written/upload-delete] Database error: " . $exception->getMessage());
        return -61705;
    }
}

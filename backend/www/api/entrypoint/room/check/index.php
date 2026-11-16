<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../activity.php";

$ROLE = "";

/**
 * Check that a student still has a seat in a class room (the teacher can free it
 * with `room/kick`). The students call it regularly, so it also remembers
 * the last time the student has been seen.
 *
 * @param mixed $input
 * ```ts
 * {
 *   classroomCode: string // Field `code` of table `class`.
 *   computer: string // Unique identifier of the student's computer.
 * }
 * ```
 * @return mixed `true` if the student has a seat, `false` otherwise. Or an error code:
 * * -40301: Invalid input.
 * * -40302: There is no class room with this code.
 */
function entrypoint($input)
{
    global $DB;

    $classroomCode = $input["classroomCode"] ?? null;
    $computer = $input["computer"] ?? null;

    if (!isNonEmptyString($classroomCode) || !isNonEmptyString($computer)) {
        error_log("[room/check] Invalid input.");
        return -40301;
    }

    $class = findClassByCode($classroomCode);
    if ($class === false) {
        error_log("[room/check] Class room \"$classroomCode\" does not exist.");
        return -40302;
    }

    $stmt = $DB->query(
        "UPDATE `{$DB->table("seat")}` SET `time` = NOW() WHERE `classroom` = ? AND `computer` = ?",
        $class["id"],
        $computer
    );
    if ($stmt !== false && $stmt->rowCount() > 0) {
        return true;
    }

    // `rowCount()` is 0 if `time` has not changed (two calls in the same second).
    $stmt = $DB->query(
        "SELECT 1 FROM `{$DB->table("seat")}` WHERE `classroom` = ? AND `computer` = ?",
        $class["id"],
        $computer
    );
    return $stmt !== false && $stmt->fetch() !== false;
}

<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../activity.php";

$ROLE = "";

/**
 * Get the code of the activity the students of a class room must currently display.
 *
 * @param mixed $input
 * ```ts
 * {
 *   classroomCode: string // Field `code` of table `class`.
 * }
 * ```
 * @return mixed In case of success, the activity code (`string`),
 * or `null` if there is no current activity. Otherwise:
 * * -30401: Invalid input.
 * * -30402: There is no class room with this code.
 */
function entrypoint($input)
{
    $classroomCode = $input["classroomCode"] ?? null;

    if (!isNonEmptyString($classroomCode)) {
        error_log("[activity/current] Invalid input.");
        return -30401;
    }

    $class = findClassByCode($classroomCode);
    if ($class === false) {
        error_log("[activity/current] Class room \"$classroomCode\" does not exist.");
        return -30402;
    }

    return $class["activity"];
}

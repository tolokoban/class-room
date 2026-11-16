<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "";

/**
 * Everything a student needs to display a written production:
 * what is expected, the timer and the files already uploaded from this computer.
 *
 * A student can only see the current activity of the class room (the description
 * of the exercise must stay hidden before). The owner of the class room can see
 * every written production assigned to it ("preview" mode).
 *
 * @param mixed $input
 * ```ts
 * {
 *   writtenId: number // Field `id` of table `written`.
 *   classroomCode: string // Field `code` of table `class`.
 *   computer?: string // Unique identifier of the student's computer.
 * }
 * ```
 * @return mixed In case of success:
 * ```ts
 * {
 *   now: number // Current UNIX timestamp of the server (seconds).
 *   preview: boolean // `true` for the owner of the class room.
 *   seated: boolean // Does this computer have a seat in the class room?
 *   id: number
 *   name: string
 *   description: string // Markdown.
 *   duration: number // Minutes.
 *   expiration: number // Hours.
 *   files: Array<{ name: string, mimeTypes: string[], maxSize: number }>
 *   timer: Timer // See `getTimer()` in `written.php`.
 *   uploads: Array<{ slot: string, original: string, mime: string, size: number, late: boolean, time: number }>
 * }
 * ```
 * Otherwise:
 * * -61301: Invalid input.
 * * -61302: There is no class room with this code.
 * * -61303: This written production does not exist or is not assigned to this class room.
 * * -61304: This written production is not the current activity of the class room.
 */
function entrypoint($input)
{
    $computer = $input["computer"] ?? null;
    if ($computer !== null && !isNonEmptyString($computer)) {
        error_log("[written/state] Invalid input: `computer`.");
        return -61301;
    }
    $resolved = resolvePublicAssignment($input["writtenId"] ?? null, $input["classroomCode"] ?? null, 61300, "written/state");
    if (is_int($resolved)) {
        return $resolved;
    }
    ["class" => $class, "written" => $written, "assignment" => $assignment] = $resolved;

    $preview = isClassOwner($class);
    if (!$preview && $class["activity"] !== WRITTEN_ACTIVITY_PREFIX . $written["id"]) {
        error_log("[written/state] Written production #{$written["id"]} is not the current activity.");
        return -61304;
    }

    $uploads = $computer === null ? [] : array_map("getPublicUpload", listUploads($assignment["id"], $computer));
    return array_merge(getWrittenInfos($written), [
        "now" => time(),
        "preview" => $preview,
        "seated" => $computer !== null && findSeat($class["id"], $computer) !== false,
        "timer" => getTimer($assignment),
        "uploads" => $uploads,
    ]);
}

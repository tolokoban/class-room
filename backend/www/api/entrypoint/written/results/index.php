<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "teacher";

/**
 * Everything the teacher needs to follow a written production in a class room:
 * the definition of the production, the state of its timer and the uploaded files.
 *
 * @param mixed $input
 * ```ts
 * {
 *   writtenId: number // Field `id` of table `written`.
 *   classroomCode: string // Field `code` of table `class`.
 * }
 * ```
 * @return mixed In case of success:
 * ```ts
 * {
 *   now: number // Current UNIX timestamp of the server (seconds).
 *   id: number
 *   name: string
 *   description: string
 *   duration: number
 *   expiration: number
 *   files: Array<{ name: string, mimeTypes: string[], maxSize: number }>
 *   attachments: Array<{ id: number, name: string, mime: string, size: number }> // See `written/attachment-get`.
 *   timer: Timer // See `getTimer()` in `written.php`.
 *   // Complete uploads, sorted by nickname and expected file.
 *   uploads: Array<{
 *     id: number
 *     nickname: string
 *     hash: string // Short public identifier of the computer of the student.
 *     slot: string // Name of the expected file.
 *     original: string // Name of the file on the student's computer.
 *     mime: string
 *     size: number // Bytes.
 *     late: boolean // Uploaded after the end of the timer.
 *     time: number // UNIX timestamp (seconds).
 *     downloadName: string // `{nickname}.{slot}.{hash}.{ext}`
 *   }>
 * }
 * ```
 * Otherwise:
 * * -60901: Invalid input.
 * * -60902: There is no class room with this code.
 * * -60903: You are not the owner of this class room.
 * * -60904: There is no written production with this ID.
 * * -60905: You are not the owner of this written production.
 * * -60906: This written production is not assigned to this class room.
 */
function entrypoint($input)
{
    $resolved = resolveAssignment($input["writtenId"] ?? null, $input["classroomCode"] ?? null, 60900, "written/results");
    if (is_int($resolved)) {
        return $resolved;
    }
    ["written" => $written, "assignment" => $assignment] = $resolved;

    collectWrittenGarbage();
    $uploads = array_map(fn($upload) => [
        "id" => $upload["id"],
        "nickname" => $upload["nickname"],
        "hash" => getComputerHash($upload["computer"]),
        "slot" => $upload["slot"],
        "original" => $upload["original"],
        "mime" => $upload["mime"],
        "size" => $upload["size"],
        "late" => $upload["late"],
        "time" => $upload["time"],
        "downloadName" => getUploadDownloadName($upload["nickname"], $upload["slot"], $upload["computer"], $upload["ext"]),
    ], listUploads($assignment["id"]));

    return array_merge(getWrittenInfos($written), [
        "now" => time(),
        "timer" => getTimer($assignment),
        "uploads" => $uploads,
    ]);
}

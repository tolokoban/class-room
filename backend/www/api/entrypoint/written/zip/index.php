<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "teacher";

/**
 * Download all the files uploaded for a written production of a class room, as a ZIP archive.
 * It is meant to be the target of a link, so the params can be passed in the query string:
 * `api/written/zip?writtenId=12&classroomCode=3A`.
 * The files are named `{nickname}.{name}.{hash}.{ext}` (see `getUploadDownloadName()`).
 *
 * @param mixed $input
 * ```ts
 * {
 *   writtenId: number // Field `id` of table `written`.
 *   classroomCode: string // Field `code` of table `class`.
 * }
 * ```
 * @return mixed In case of success, the archive is sent and the script stops.
 * Otherwise (with HTTP status 400):
 * * -61201: Invalid input.
 * * -61202: There is no class room with this code.
 * * -61203: You are not the owner of this class room.
 * * -61204: There is no written production with this ID.
 * * -61205: You are not the owner of this written production.
 * * -61206: This written production is not assigned to this class room.
 */
function entrypoint($input)
{
    $writtenId = $input["writtenId"] ?? $_GET["writtenId"] ?? null;
    if (is_string($writtenId) && ctype_digit($writtenId)) {
        $writtenId = (int) $writtenId;
    }
    $classroomCode = $input["classroomCode"] ?? $_GET["classroomCode"] ?? null;

    $resolved = resolveAssignment($writtenId, $classroomCode, 61200, "written/zip");
    if (is_int($resolved)) {
        http_response_code(400);
        return $resolved;
    }
    ["written" => $written, "assignment" => $assignment] = $resolved;

    $entries = array_map(fn($upload) => [
        "name" => getUploadDownloadName($upload["nickname"], $upload["slot"], $upload["computer"], $upload["ext"]),
        "path" => getUploadPath($upload["id"], $upload["ext"]),
    ], listUploads($assignment["id"]));

    $zipName = trim(preg_replace('#[\x00-\x1f\x7f/\\\\:*?"<>|]+#', "_", "{$written["name"]} ($classroomCode)"));
    sendZip("$zipName.zip", $entries);
}

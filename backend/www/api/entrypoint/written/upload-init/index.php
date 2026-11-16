<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "";

/**
 * Step 1 of 3 of an upload: a student declares a file to upload for an expected file.
 * Then, the content is sent by chunks with `written/upload-chunk`,
 * and the upload is finalized with `written/upload-complete`.
 *
 * The student must have a seat in the class room, and the timer must have been started.
 * Uploading after the end of the timer is allowed (the file is marked as "late"),
 * but not after the expiration of the files.
 *
 * A previous incomplete upload for the same expected file is cancelled.
 * The complete one is kept until the new one is complete.
 *
 * @param mixed $input
 * ```ts
 * {
 *   writtenId: number // Field `id` of table `written`.
 *   classroomCode: string // Field `code` of table `class`.
 *   computer: string // Unique identifier of the student's computer.
 *   slot: string // Name of the expected file.
 *   name: string // Name of the file on the student's computer.
 *   size: number // Size of the file in bytes.
 *   mime: string // Mime type given by the browser.
 * }
 * ```
 * @return mixed In case of success: `{ uploadId: number, chunkSize: number }`
 * where `chunkSize` is the maximum size (in bytes) of a chunk. Otherwise:
 * * -61401: Invalid input.
 * * -61402: There is no class room with this code.
 * * -61403: This written production does not exist or is not assigned to this class room.
 * * -61404: You don't have a seat in this class room.
 * * -61405: The exercise has not started yet.
 * * -61406: The files of this exercise have expired.
 * * -61407: There is no expected file with this name.
 * * -61408: The file is too large (or empty).
 * * -61409: This type of file is not accepted.
 * * -61410: Not enough space on the server, or unable to store the file (reported in the logs).
 * * -61411: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $computer = $input["computer"] ?? null;
    $slot = $input["slot"] ?? null;
    $name = sanitizeFileName($input["name"] ?? null);
    $size = $input["size"] ?? null;
    if (!isNonEmptyString($computer) || !is_string($slot) || $name === false || !is_int($size)) {
        error_log("[written/upload-init] Invalid input.");
        return -61401;
    }
    $mime = normalizeMime($input["mime"] ?? null);

    $resolved = resolvePublicAssignment($input["writtenId"] ?? null, $input["classroomCode"] ?? null, 61400, "written/upload-init");
    if (is_int($resolved)) {
        return $resolved;
    }
    ["class" => $class, "written" => $written, "assignment" => $assignment] = $resolved;

    $seat = findSeat($class["id"], $computer);
    if ($seat === false) {
        error_log("[written/upload-init] This computer has no seat in class room #{$class["id"]}.");
        return -61404;
    }
    $allowed = canUpload($assignment);
    if ($allowed !== true) {
        error_log("[written/upload-init] Uploads are not allowed: $allowed.");
        return $allowed === "idle" ? -61405 : -61406;
    }
    $expected = findExpectedFile($written, $slot);
    if ($expected === false) {
        error_log("[written/upload-init] Unknown expected file \"$slot\".");
        return -61407;
    }
    if ($size < 1 || $size > $expected["maxSize"]) {
        error_log("[written/upload-init] Invalid size: $size bytes (max is {$expected["maxSize"]}).");
        return -61408;
    }
    $mime = guessMime($mime, $name, $expected);
    if (!isMimeAccepted($mime, $expected)) {
        error_log("[written/upload-init] Mime type \"$mime\" is not accepted for \"$slot\".");
        return -61409;
    }

    collectWrittenGarbage();
    deleteUploads(
        "`u`.`assignment` = ? AND `u`.`computer` = ? AND `u`.`slot` = ? AND `u`.`complete` = 0",
        $assignment["id"],
        $computer,
        $slot
    );
    if (!is_dir(WRITTEN_ROOT) && !@mkdir(WRITTEN_ROOT, 0775, true) && !is_dir(WRITTEN_ROOT)) {
        error_log("[written/upload-init] Unable to create folder \"" . WRITTEN_ROOT . "\".");
        return -61410;
    }
    $free = @disk_free_space(WRITTEN_ROOT);
    if ($free !== false && $free < 2 * $size) {
        error_log("[written/upload-init] Not enough space on the server: $free bytes left.");
        return -61410;
    }

    try {
        $DB->query(
            "INSERT INTO `{$DB->table("written_upload")}`
             (`assignment`, `computer`, `nickname`, `slot`, `original`, `mime`, `ext`, `size`, `time`)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            $assignment["id"],
            $computer,
            $seat["nickname"],
            $slot,
            $name,
            $mime,
            getUploadExtension($mime, $name),
            $size,
            time()
        );
        $uploadId = (int) $DB->lastId();
    } catch (Exception $exception) {
        error_log("[written/upload-init] Database error: " . $exception->getMessage());
        return -61411;
    }

    $path = getUploadPath($uploadId, "", true);
    $dir = dirname($path);
    if ((!is_dir($dir) && !@mkdir($dir, 0775, true) && !is_dir($dir)) || @file_put_contents($path, "") === false) {
        error_log("[written/upload-init] Unable to create \"$path\".");
        deleteUploads("`u`.`id` = ?", $uploadId);
        return -61410;
    }

    return ["uploadId" => $uploadId, "chunkSize" => WRITTEN_MAX_CHUNK_SIZE];
}

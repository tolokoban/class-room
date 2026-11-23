<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../activity.php";
require_once __DIR__ . "/../../../class.php";
require_once __DIR__ . "/../../../file.php";

$ROLE = "teacher";

/**
 * Step 1 of 3 of the upload of a file in a class room owned by the current user.
 * Then, the content is sent by chunks with `file/upload-chunk`,
 * and the upload is finalized with `file/upload-complete`.
 *
 * Give `classroomCode` to add a new file, or `fileId` to replace an existing one
 * (its content and its name; the mime type must stay the same).
 *
 * @param mixed $input
 * ```ts
 * {
 *   classroomCode?: string // Field `code` of table `class` (new file).
 *   fileId?: number // Field `id` of table `files` (replaced file).
 *   name: string // Name of the file, with its extension. Any folder is removed.
 *   size: number // Size of the file in bytes.
 *   mime: string // Mime type given by the browser.
 * }
 * ```
 * @return mixed In case of success: `{ uploadId: number, chunkSize: number }`
 * where `chunkSize` is the maximum size (in bytes) of a chunk. Otherwise:
 * * -50801: Invalid input.
 * * -50802: There is no class room with this code.
 * * -50803: There is no file with this ID.
 * * -50804: You are not the owner of this class room.
 * * -50805: There is already another file with this name in this class room.
 * * -50806: This name is reserved (see `NOTES_FILE_NAME`), or the replaced file is the notes of the class room.
 * * -50807: The mime type is not the same as the one of the replaced file.
 * * -50808: The file is too large (see `FILE_MAX_SIZE`).
 * * -50809: Not enough space on the server, or unable to store the file (reported in the logs).
 * * -50810: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $classroomCode = $input["classroomCode"] ?? null;
    $fileId = $input["fileId"] ?? null;
    $name = sanitizeFileName($input["name"] ?? null);
    $size = $input["size"] ?? null;
    // Exactly one of `classroomCode` and `fileId`.
    if (isNonEmptyString($classroomCode) === is_int($fileId) || $name === false || !is_int($size)) {
        error_log("[file/upload-init] Invalid input.");
        return -50801;
    }
    $mime = normalizeMime($input["mime"] ?? null);

    if (isReservedFileName($name)) {
        error_log("[file/upload-init] The name \"$name\" is reserved.");
        return -50806;
    }
    if ($size < 0 || $size > FILE_MAX_SIZE) {
        error_log("[file/upload-init] Invalid size: $size bytes.");
        return -50808;
    }

    $user = $_SESSION["USER"];
    if (is_int($fileId)) {
        $file = findFile($fileId);
        if ($file === false) {
            error_log("[file/upload-init] File #{$fileId} does not exist.");
            return -50803;
        }
        if ($file["user"] !== $user["id"]) {
            error_log("[file/upload-init] User \"{$user["login"]}\" is not the owner of file #{$fileId}.");
            return -50804;
        }
        if (isReservedFileName($file["name"])) {
            error_log("[file/upload-init] File #{$fileId} holds the notes of class room #{$file["classroom"]}.");
            return -50806;
        }
        if ($mime !== $file["mime"]) {
            error_log("[file/upload-init] Mime type mismatch for file #{$fileId}: \"$mime\" instead of \"{$file["mime"]}\".");
            return -50807;
        }
        $classroomId = $file["classroom"];
    } else {
        $class = findClassByCode($classroomCode);
        if ($class === false) {
            error_log("[file/upload-init] Class room \"$classroomCode\" does not exist.");
            return -50802;
        }
        if ($class["user"] !== $user["id"]) {
            error_log("[file/upload-init] User \"{$user["login"]}\" is not the owner of class room \"$classroomCode\".");
            return -50804;
        }
        $classroomId = $class["id"];
    }

    if (isFileNameUsed($classroomId, $name, $fileId)) {
        error_log("[file/upload-init] Another file is already called \"$name\" in class room #$classroomId.");
        return -50805;
    }

    collectFileUploadGarbage();
    $root = FILE_UPLOADS_ROOT;
    if (!is_dir($root) && !@mkdir($root, 0775, true) && !is_dir($root)) {
        error_log("[file/upload-init] Unable to create folder \"$root\".");
        return -50809;
    }
    $free = @disk_free_space($root);
    if ($free !== false && $free < 2 * $size) {
        error_log("[file/upload-init] Not enough space on the server: $free bytes left.");
        return -50809;
    }

    try {
        $DB->query(
            "INSERT INTO `{$DB->table("file_upload")}` (`classroom`, `file`, `name`, `mime`, `size`, `time`)
             VALUES (?, ?, ?, ?, ?, ?)",
            $classroomId,
            $fileId,
            $name,
            $mime,
            $size,
            time()
        );
        $uploadId = (int) $DB->lastId();
    } catch (Exception $exception) {
        error_log("[file/upload-init] Database error: " . $exception->getMessage());
        return -50810;
    }

    $path = getFileUploadPath($uploadId);
    $dir = dirname($path);
    if ((!is_dir($dir) && !@mkdir($dir, 0775, true) && !is_dir($dir)) || @file_put_contents($path, "") === false) {
        error_log("[file/upload-init] Unable to create \"$path\".");
        $DB->query("DELETE FROM `{$DB->table("file_upload")}` WHERE `id` = ?", $uploadId);
        return -50809;
    }

    return ["uploadId" => $uploadId, "chunkSize" => FILE_MAX_CHUNK_SIZE];
}

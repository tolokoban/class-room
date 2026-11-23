<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../file.php";

$ROLE = "teacher";

/**
 * Step 2 of 3 of the upload of a file (see `file/upload-init`): send a chunk of the content.
 *
 * The chunk is written at `offset`. Sending the same chunk twice is harmless
 * (useful to retry after a network error), but there must not be any hole:
 * `offset` cannot be greater than the number of bytes already received.
 *
 * @param mixed $input
 * ```ts
 * {
 *   uploadId: number // See `file/upload-init`.
 *   offset: number // Position of this chunk in the file, in bytes.
 *   data: string // Content of the chunk, encoded in base64.
 * }
 * ```
 * @return mixed In case of success: `{ received: number }` (bytes received so far). Otherwise:
 * * -50901: Invalid input.
 * * -50902: There is no upload in progress with this ID in your class rooms.
 * * -50903: Invalid offset or size of the chunk.
 * * -50904: Unable to store the chunk on the server (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $uploadId = $input["uploadId"] ?? null;
    $offset = $input["offset"] ?? null;
    $data = $input["data"] ?? null;
    $content = is_string($data) ? base64_decode($data, true) : false;
    if (!is_int($uploadId) || !is_int($offset) || $content === false) {
        error_log("[file/upload-chunk] Invalid input.");
        return -50901;
    }

    $upload = findOwnedFileUpload($uploadId);
    if ($upload === false) {
        error_log("[file/upload-chunk] There is no upload #$uploadId for this user.");
        return -50902;
    }

    $length = strlen($content);
    if (
        $length === 0 || $length > FILE_MAX_CHUNK_SIZE
        || $offset < 0 || $offset > $upload["received"] || $offset + $length > $upload["size"]
    ) {
        error_log("[file/upload-chunk] Invalid chunk: $length bytes at $offset for upload #$uploadId.");
        return -50903;
    }

    $path = getFileUploadPath($uploadId);
    $file = @fopen($path, "c");
    if ($file === false) {
        error_log("[file/upload-chunk] Unable to open \"$path\".");
        return -50904;
    }
    $written = fseek($file, $offset) === 0 ? fwrite($file, $content) : false;
    fclose($file);
    if ($written !== $length) {
        error_log("[file/upload-chunk] Unable to write in \"$path\".");
        return -50904;
    }

    $received = max($upload["received"], $offset + $length);
    $DB->query(
        "UPDATE `{$DB->table("file_upload")}` SET `received` = ?, `time` = ? WHERE `id` = ?",
        $received,
        time(),
        $uploadId
    );

    return ["received" => $received];
}

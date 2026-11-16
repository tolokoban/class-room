<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "";

/**
 * Step 2 of 3 of an upload (see `written/upload-init`): send a chunk of the content.
 *
 * The chunk is written at `offset`. Sending the same chunk twice is harmless
 * (useful to retry after a network error), but there must not be any hole:
 * `offset` cannot be greater than the number of bytes already received.
 *
 * @param mixed $input
 * ```ts
 * {
 *   uploadId: number // See `written/upload-init`.
 *   computer: string // Unique identifier of the student's computer.
 *   offset: number // Position of this chunk in the file, in bytes.
 *   data: string // Content of the chunk, encoded in base64.
 * }
 * ```
 * @return mixed In case of success: `{ received: number }` (bytes received so far). Otherwise:
 * * -61501: Invalid input.
 * * -61502: There is no incomplete upload with this ID for this computer.
 * * -61503: Invalid offset or size of the chunk.
 * * -61504: Unable to store the chunk on the server (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $uploadId = $input["uploadId"] ?? null;
    $computer = $input["computer"] ?? null;
    $offset = $input["offset"] ?? null;
    $data = $input["data"] ?? null;
    $content = is_string($data) ? base64_decode($data, true) : false;
    if (!is_int($uploadId) || !isNonEmptyString($computer) || !is_int($offset) || $content === false) {
        error_log("[written/upload-chunk] Invalid input.");
        return -61501;
    }

    $stmt = $DB->query(
        "SELECT `size`, `received` FROM `{$DB->table("written_upload")}`
         WHERE `id` = ? AND `computer` = ? AND `complete` = 0",
        $uploadId,
        $computer
    );
    $upload = $stmt === false ? false : $stmt->fetch();
    if ($upload === false) {
        error_log("[written/upload-chunk] There is no incomplete upload #$uploadId for this computer.");
        return -61502;
    }

    $length = strlen($content);
    $size = (int) $upload["size"];
    if (
        $length === 0 || $length > WRITTEN_MAX_CHUNK_SIZE
        || $offset < 0 || $offset > (int) $upload["received"] || $offset + $length > $size
    ) {
        error_log("[written/upload-chunk] Invalid chunk: $length bytes at $offset for upload #$uploadId.");
        return -61503;
    }

    $path = getUploadPath($uploadId, "", true);
    $file = @fopen($path, "c");
    if ($file === false) {
        error_log("[written/upload-chunk] Unable to open \"$path\".");
        return -61504;
    }
    $written = fseek($file, $offset) === 0 ? fwrite($file, $content) : false;
    fclose($file);
    if ($written !== $length) {
        error_log("[written/upload-chunk] Unable to write in \"$path\".");
        return -61504;
    }

    $received = max((int) $upload["received"], $offset + $length);
    $DB->query(
        "UPDATE `{$DB->table("written_upload")}` SET `received` = ?, `time` = ? WHERE `id` = ?",
        $received,
        time(),
        $uploadId
    );

    return ["received" => $received];
}

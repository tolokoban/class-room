<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "teacher";

/**
 * Step 2 of 3 of the upload of an attachment (see `written/attachment-init`): send a chunk of the content.
 *
 * The chunk is written at `offset`. Sending the same chunk twice is harmless
 * (useful to retry after a network error), but there must not be any hole:
 * `offset` cannot be greater than the number of bytes already received.
 *
 * @param mixed $input
 * ```ts
 * {
 *   attachmentId: number // See `written/attachment-init`.
 *   offset: number // Position of this chunk in the file, in bytes.
 *   data: string // Content of the chunk, encoded in base64.
 * }
 * ```
 * @return mixed In case of success: `{ received: number }` (bytes received so far). Otherwise:
 * * -62001: Invalid input.
 * * -62002: There is no incomplete attachment with this ID in your written productions.
 * * -62003: Invalid offset or size of the chunk.
 * * -62004: Unable to store the chunk on the server (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $attachmentId = $input["attachmentId"] ?? null;
    $offset = $input["offset"] ?? null;
    $data = $input["data"] ?? null;
    $content = is_string($data) ? base64_decode($data, true) : false;
    if (!is_int($attachmentId) || !is_int($offset) || $content === false) {
        error_log("[written/attachment-chunk] Invalid input.");
        return -62001;
    }

    $attachment = findOwnedAttachment($attachmentId);
    if (!is_array($attachment) || $attachment["complete"]) {
        error_log("[written/attachment-chunk] There is no incomplete attachment #$attachmentId for this user.");
        return -62002;
    }

    $length = strlen($content);
    $size = $attachment["size"];
    if (
        $length === 0 || $length > WRITTEN_MAX_CHUNK_SIZE
        || $offset < 0 || $offset > $attachment["received"] || $offset + $length > $size
    ) {
        error_log("[written/attachment-chunk] Invalid chunk: $length bytes at $offset for attachment #$attachmentId.");
        return -62003;
    }

    $path = getAttachmentPath($attachmentId, "", true);
    $file = @fopen($path, "c");
    if ($file === false) {
        error_log("[written/attachment-chunk] Unable to open \"$path\".");
        return -62004;
    }
    $written = fseek($file, $offset) === 0 ? fwrite($file, $content) : false;
    fclose($file);
    if ($written !== $length) {
        error_log("[written/attachment-chunk] Unable to write in \"$path\".");
        return -62004;
    }

    $received = max($attachment["received"], $offset + $length);
    $DB->query(
        "UPDATE `{$DB->table("written_attachment")}` SET `received` = ?, `time` = ? WHERE `id` = ?",
        $received,
        time(),
        $attachmentId
    );

    return ["received" => $received];
}

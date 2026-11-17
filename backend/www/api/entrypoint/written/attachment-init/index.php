<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "teacher";

/**
 * Step 1 of 3 of the upload of a file attached to a written production owned by the current user.
 * Then, the content is sent by chunks with `written/attachment-chunk`,
 * and the upload is finalized with `written/attachment-complete`.
 *
 * If an attachment with the same name already exists, it is replaced once the new one is complete
 * (so the `attachment:` links of the description keep working).
 * A previous incomplete upload with the same name is cancelled.
 *
 * @param mixed $input
 * ```ts
 * {
 *   writtenId: number // Field `id` of table `written`.
 *   name: string // Name of the file, with its extension. Any folder is removed.
 *   size: number // Size of the file in bytes.
 *   mime: string // Mime type given by the browser.
 * }
 * ```
 * @return mixed In case of success: `{ attachmentId: number, chunkSize: number }`
 * where `chunkSize` is the maximum size (in bytes) of a chunk. Otherwise:
 * * -61901: Invalid input.
 * * -61902: There is no written production with this ID.
 * * -61903: You are not the owner of this written production.
 * * -61904: Too many attached files (see `WRITTEN_MAX_ATTACHMENTS`).
 * * -61905: The file is too large (or empty).
 * * -61906: Not enough space on the server, or unable to store the file (reported in the logs).
 * * -61907: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $name = sanitizeFileName($input["name"] ?? null);
    $size = $input["size"] ?? null;
    if ($name === false || !is_int($size)) {
        error_log("[written/attachment-init] Invalid input.");
        return -61901;
    }
    $mime = guessAttachmentMime(normalizeMime($input["mime"] ?? null), $name);

    $written = resolveOwnedWritten($input["writtenId"] ?? null, 61900, "written/attachment-init");
    if (is_int($written)) {
        return $written;
    }

    if ($size < 1 || $size > WRITTEN_MAX_ATTACHMENT_SIZE) {
        error_log("[written/attachment-init] Invalid size: $size bytes.");
        return -61905;
    }
    // A file with the same name replaces the existing one: it does not count.
    $others = array_filter(
        listAttachments($written["id"]),
        fn($attachment) => mb_strtolower($attachment["name"]) !== mb_strtolower($name)
    );
    if (count($others) >= WRITTEN_MAX_ATTACHMENTS) {
        error_log("[written/attachment-init] Too many attachments for written production #{$written["id"]}.");
        return -61904;
    }

    collectWrittenGarbage();
    deleteAttachments("`written` = ? AND `name` = ? AND `complete` = 0", $written["id"], $name);
    $root = WRITTEN_ATTACHMENTS_ROOT;
    if (!is_dir($root) && !@mkdir($root, 0775, true) && !is_dir($root)) {
        error_log("[written/attachment-init] Unable to create folder \"$root\".");
        return -61906;
    }
    $free = @disk_free_space($root);
    if ($free !== false && $free < 2 * $size) {
        error_log("[written/attachment-init] Not enough space on the server: $free bytes left.");
        return -61906;
    }

    try {
        $DB->query(
            "INSERT INTO `{$DB->table("written_attachment")}` (`written`, `name`, `mime`, `ext`, `size`, `time`)
             VALUES (?, ?, ?, ?, ?, ?)",
            $written["id"],
            $name,
            $mime,
            getUploadExtension($mime, $name),
            $size,
            time()
        );
        $attachmentId = (int) $DB->lastId();
    } catch (Exception $exception) {
        error_log("[written/attachment-init] Database error: " . $exception->getMessage());
        return -61907;
    }

    $path = getAttachmentPath($attachmentId, "", true);
    $dir = dirname($path);
    if ((!is_dir($dir) && !@mkdir($dir, 0775, true) && !is_dir($dir)) || @file_put_contents($path, "") === false) {
        error_log("[written/attachment-init] Unable to create \"$path\".");
        deleteAttachments("`id` = ?", $attachmentId);
        return -61906;
    }

    return ["attachmentId" => $attachmentId, "chunkSize" => WRITTEN_MAX_CHUNK_SIZE];
}

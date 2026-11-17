<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "teacher";

/**
 * Step 3 of 3 of the upload of an attachment (see `written/attachment-init`): all the chunks have been sent.
 *
 * The type of the file is detected on its content. The file replaces the previous attachment
 * with the same name, if any.
 *
 * @param mixed $input
 * ```ts
 * {
 *   attachmentId: number // See `written/attachment-init`.
 * }
 * ```
 * @return mixed In case of success: `{ id: number, name: string, mime: string, size: number }`.
 * Otherwise:
 * * -62101: Invalid input.
 * * -62102: There is no incomplete attachment with this ID in your written productions.
 * * -62103: Some chunks are missing.
 * * -62104: Unable to store the file on the server (reported in the logs).
 * * -62105: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $attachmentId = $input["attachmentId"] ?? null;
    if (!is_int($attachmentId)) {
        error_log("[written/attachment-complete] Invalid input.");
        return -62101;
    }

    $attachment = findOwnedAttachment($attachmentId);
    if (!is_array($attachment) || $attachment["complete"]) {
        error_log("[written/attachment-complete] There is no incomplete attachment #$attachmentId for this user.");
        return -62102;
    }

    $partPath = getAttachmentPath($attachmentId, "", true);
    $size = $attachment["size"];
    clearstatcache(true, $partPath);
    if ($attachment["received"] !== $size || @filesize($partPath) !== $size) {
        error_log("[written/attachment-complete] Attachment #$attachmentId is incomplete.");
        return -62103;
    }

    $mime = detectMime($partPath, $attachment["mime"]);
    $ext = getUploadExtension($mime, $attachment["name"]);
    if (!@rename($partPath, getAttachmentPath($attachmentId, $ext))) {
        error_log("[written/attachment-complete] Unable to rename \"$partPath\".");
        return -62104;
    }

    try {
        $DB->query(
            "UPDATE `{$DB->table("written_attachment")}`
             SET `complete` = 1, `mime` = ?, `ext` = ?, `time` = ? WHERE `id` = ?",
            $mime,
            $ext,
            time(),
            $attachmentId
        );
        // The new file replaces the previous one.
        deleteAttachments(
            "`written` = ? AND `name` = ? AND `complete` = 1 AND `id` <> ?",
            $attachment["written"],
            $attachment["name"],
            $attachmentId
        );
    } catch (Exception $exception) {
        error_log("[written/attachment-complete] Database error: " . $exception->getMessage());
        return -62105;
    }

    return [
        "id" => $attachmentId,
        "name" => $attachment["name"],
        "mime" => $mime,
        "size" => $size,
    ];
}

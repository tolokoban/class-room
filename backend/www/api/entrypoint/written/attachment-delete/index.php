<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "teacher";

/**
 * Delete a file attached to a written production owned by the current user.
 *
 * @param mixed $input
 * ```ts
 * {
 *   attachmentId: number // Field `id` of table `written_attachment`.
 * }
 * ```
 * @return int
 * * 0: Deletion successful.
 * * -62201: Invalid input.
 * * -62202: There is no attachment with this ID.
 * * -62203: You are not the owner of this attachment.
 * * -62204: Database error (reported in the logs).
 */
function entrypoint($input)
{
    $attachmentId = $input["attachmentId"] ?? null;
    if (!is_int($attachmentId)) {
        error_log("[written/attachment-delete] Invalid input.");
        return -62201;
    }

    $attachment = findOwnedAttachment($attachmentId);
    if ($attachment === "missing") {
        error_log("[written/attachment-delete] Attachment #$attachmentId does not exist.");
        return -62202;
    }
    if ($attachment === "forbidden") {
        error_log("[written/attachment-delete] You are not the owner of attachment #$attachmentId.");
        return -62203;
    }

    try {
        deleteAttachments("`id` = ?", $attachmentId);
    } catch (Exception $exception) {
        error_log("[written/attachment-delete] Database error: " . $exception->getMessage());
        return -62204;
    }
    return 0;
}

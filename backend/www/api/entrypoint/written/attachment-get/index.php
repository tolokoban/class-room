<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "";

/**
 * Send the content of a file attached to a written production.
 * It is meant to be the target of a link, so the input can be passed in the query string:
 * `api/written/attachment-get?attachmentId=123&classroomCode=ABC`.
 *
 * The owner of the written production can always download it (`classroomCode` is not needed).
 * Anybody else can only download it while the written production is the current
 * activity of the class room `classroomCode`, whatever the state of the timer.
 *
 * @param mixed $input
 * ```ts
 * {
 *   attachmentId: number // Field `id` of table `written_attachment`.
 *   classroomCode?: string // Field `code` of table `class`.
 * }
 * ```
 * @return mixed In case of success, the content of the file is sent
 * and the script stops. Otherwise (with the matching HTTP status):
 * * -62301: Invalid input.
 * * -62302: There is no attachment with this ID.
 * * -62303: This written production is not the current activity of the class room.
 * * -62304: The content of the file is missing on the server (reported in the logs).
 */
function entrypoint($input)
{
    $attachmentId = $input["attachmentId"] ?? $_GET["attachmentId"] ?? null;
    if (is_string($attachmentId) && ctype_digit($attachmentId)) {
        $attachmentId = (int) $attachmentId;
    }
    $classroomCode = $input["classroomCode"] ?? $_GET["classroomCode"] ?? null;
    if (!is_int($attachmentId) || ($classroomCode !== null && !is_string($classroomCode))) {
        error_log("[written/attachment-get] Invalid input.");
        http_response_code(400);
        return -62301;
    }

    $attachment = findAttachment($attachmentId);
    if ($attachment === false || !$attachment["complete"]) {
        error_log("[written/attachment-get] Attachment #$attachmentId does not exist.");
        http_response_code(404);
        return -62302;
    }

    if (!canGetAttachment($attachment, $classroomCode)) {
        error_log("[written/attachment-get] Written production #{$attachment["written"]} is not the current activity.");
        http_response_code(403);
        return -62303;
    }

    $path = getAttachmentPath($attachmentId, $attachment["ext"]);
    if (!is_file($path)) {
        error_log("[written/attachment-get] Missing content for attachment #$attachmentId: \"$path\".");
        http_response_code(404);
        return -62304;
    }

    sendFileContent($path, $attachment["name"], $attachment["mime"]);
}

/**
 * The owner can always get the file. The students only while the written production
 * is the current activity of the class room.
 */
function canGetAttachment(array $attachment, ?string $classroomCode): bool
{
    $user = $_SESSION["USER"] ?? null;
    if ($user !== null && $attachment["owner"] === $user["id"]) {
        return true;
    }
    if (!isNonEmptyString($classroomCode)) {
        return false;
    }
    $class = findClassByCode($classroomCode);
    return $class !== false
        && $class["activity"] === WRITTEN_ACTIVITY_PREFIX . $attachment["written"]
        && findAssignment($attachment["written"], $class["id"]) !== false;
}

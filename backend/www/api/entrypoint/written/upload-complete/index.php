<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "";

/**
 * Step 3 of 3 of an upload (see `written/upload-init`): all the chunks have been sent.
 *
 * The type of the file is checked on its content. If it is accepted, the file replaces
 * the previous one uploaded by this computer for the same expected file.
 *
 * @param mixed $input
 * ```ts
 * {
 *   uploadId: number // See `written/upload-init`.
 *   computer: string // Unique identifier of the student's computer.
 * }
 * ```
 * @return mixed In case of success:
 * `{ slot: string, original: string, mime: string, size: number, late: boolean, time: number }`.
 * Otherwise:
 * * -61601: Invalid input.
 * * -61602: There is no incomplete upload with this ID for this computer.
 * * -61603: Some chunks are missing.
 * * -61604: This type of file is not accepted (the upload is cancelled).
 * * -61605: Unable to store the file on the server (reported in the logs).
 * * -61606: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $uploadId = $input["uploadId"] ?? null;
    $computer = $input["computer"] ?? null;
    if (!is_int($uploadId) || !isNonEmptyString($computer)) {
        error_log("[written/upload-complete] Invalid input.");
        return -61601;
    }

    $stmt = $DB->query(
        "SELECT `u`.*, `a`.`written`, `a`.`end_time` FROM `{$DB->table("written_upload")}` AS `u`
         JOIN `{$DB->table("written_assignment")}` AS `a` ON `a`.`id` = `u`.`assignment`
         WHERE `u`.`id` = ? AND `u`.`computer` = ? AND `u`.`complete` = 0",
        $uploadId,
        $computer
    );
    $upload = $stmt === false ? false : $stmt->fetch();
    if ($upload === false) {
        error_log("[written/upload-complete] There is no incomplete upload #$uploadId for this computer.");
        return -61602;
    }

    $partPath = getUploadPath($uploadId, "", true);
    $size = (int) $upload["size"];
    clearstatcache(true, $partPath);
    if ((int) $upload["received"] !== $size || @filesize($partPath) !== $size) {
        error_log("[written/upload-complete] Upload #$uploadId is incomplete.");
        return -61603;
    }

    $written = findWritten((int) $upload["written"]);
    $expected = $written === false ? false : findExpectedFile($written, $upload["slot"]);
    $mime = detectMime($partPath, $upload["mime"]);
    if ($expected === false || !isMimeAccepted($mime, $expected)) {
        error_log("[written/upload-complete] Mime type \"$mime\" is not accepted for \"{$upload["slot"]}\".");
        deleteUploads("`u`.`id` = ?", $uploadId);
        return -61604;
    }

    $ext = getUploadExtension($mime, $upload["original"]);
    if (!@rename($partPath, getUploadPath($uploadId, $ext))) {
        error_log("[written/upload-complete] Unable to rename \"$partPath\".");
        return -61605;
    }

    $now = time();
    $late = $upload["end_time"] !== null && $now > (int) $upload["end_time"];
    try {
        $DB->query(
            "UPDATE `{$DB->table("written_upload")}`
             SET `complete` = 1, `mime` = ?, `ext` = ?, `late` = ?, `time` = ? WHERE `id` = ?",
            $mime,
            $ext,
            $late ? 1 : 0,
            $now,
            $uploadId
        );
        // The new file replaces the previous one.
        deleteUploads(
            "`u`.`assignment` = ? AND `u`.`computer` = ? AND `u`.`slot` = ? AND `u`.`complete` = 1 AND `u`.`id` <> ?",
            (int) $upload["assignment"],
            $computer,
            $upload["slot"],
            $uploadId
        );
    } catch (Exception $exception) {
        error_log("[written/upload-complete] Database error: " . $exception->getMessage());
        return -61606;
    }

    return [
        "slot" => $upload["slot"],
        "original" => $upload["original"],
        "mime" => $mime,
        "size" => $size,
        "late" => $late,
        "time" => $now,
    ];
}

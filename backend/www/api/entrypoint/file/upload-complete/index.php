<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../class.php";
require_once __DIR__ . "/../../../file.php";

$ROLE = "teacher";

/**
 * Step 3 of 3 of the upload of a file (see `file/upload-init`): all the chunks have been sent.
 *
 * The file is added to the class room, or replaces the file given to `file/upload-init`.
 *
 * @param mixed $input
 * ```ts
 * {
 *   uploadId: number // See `file/upload-init`.
 * }
 * ```
 * @return mixed In case of success: `{ fileId: number }`. Otherwise:
 * * -51001: Invalid input.
 * * -51002: There is no upload in progress with this ID in your class rooms.
 * * -51003: Some chunks are missing.
 * * -51004: There is already another file with this name in this class room.
 * * -51005: Unable to store the file on the server (reported in the logs).
 * * -51006: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $uploadId = $input["uploadId"] ?? null;
    if (!is_int($uploadId)) {
        error_log("[file/upload-complete] Invalid input.");
        return -51001;
    }

    $upload = findOwnedFileUpload($uploadId);
    if ($upload === false) {
        error_log("[file/upload-complete] There is no upload #$uploadId for this user.");
        return -51002;
    }

    $partPath = getFileUploadPath($uploadId);
    $size = $upload["size"];
    clearstatcache(true, $partPath);
    if ($upload["received"] !== $size || @filesize($partPath) !== $size) {
        error_log("[file/upload-complete] Upload #$uploadId is incomplete.");
        return -51003;
    }

    $name = $upload["name"];
    // `null` for a new file.
    $replaced = $upload["file"] === null ? null : findFile($upload["file"]);
    if ($replaced === false) {
        error_log("[file/upload-complete] The file replaced by upload #$uploadId does not exist anymore.");
        return -51002;
    }
    $DB->begin();
    try {
        if ($replaced === null) {
            $DB->query(
                "INSERT INTO `{$DB->table("files")}` (`classroom`, `name`, `size`, `mime`) VALUES (?, ?, ?, ?)",
                $upload["classroom"],
                $name,
                $size,
                $upload["mime"]
            );
            $fileId = (int) $DB->lastId();
        } else {
            $fileId = $replaced["id"];
            $DB->query(
                "UPDATE `{$DB->table("files")}` SET `name` = ?, `size` = ? WHERE `id` = ?",
                $name,
                $size,
                $fileId
            );
        }
        $DB->query("DELETE FROM `{$DB->table("file_upload")}` WHERE `id` = ?", $uploadId);
    } catch (Exception $exception) {
        $DB->rollback();
        if (isDuplicateKeyError($exception)) {
            error_log("[file/upload-complete] Another file is already called \"$name\" in class room #{$upload["classroom"]}.");
            return -51004;
        }
        error_log("[file/upload-complete] Database error: " . $exception->getMessage());
        return -51006;
    }

    $path = getFilePath($fileId, $name);
    if (!moveFileContent($partPath, $path)) {
        $DB->rollback();
        return -51005;
    }
    $DB->commit();

    // Remove the folders of the upload that became empty.
    deleteFileContent($partPath);
    // The extension may have changed.
    if ($replaced !== null && getFilePath($fileId, $replaced["name"]) !== $path) {
        deleteFileContent(getFilePath($fileId, $replaced["name"]));
    }

    return ["fileId" => $fileId];
}

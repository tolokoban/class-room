<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../class.php";
require_once __DIR__ . "/../../../file.php";

$ROLE = "teacher";

/**
 * Replace the content and the name of an existing file of a class room
 * owned by the current user. The new content must have the same mime type.
 *
 * @param mixed $input
 * ```ts
 * {
 *   fileId: number // Field `id` of table `files`.
 *   name: string // New name of the file, with its extension. Any folder is removed.
 *   file: string // Content of the file as a base64 data URL: "data:<mime>;base64,<content>".
 * }
 * ```
 * @return mixed In case of success: `{ fileId: number }`. Otherwise:
 * * -50201: Invalid input.
 * * -50202: There is no file with this ID.
 * * -50203: You are not the owner of the class room of this file.
 * * -50204: There is already another file with this name in this class room.
 * * -50205: The mime type of the new content is not the same as the one of the replaced file.
 * * -50206: Database error (reported in the logs).
 * * -50207: Unable to store the file on the server (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $fileId = $input["fileId"] ?? null;
    $name = sanitizeFileName($input["name"] ?? null);
    $data = parseDataUrl($input["file"] ?? null);
    if (!is_int($fileId) || $name === false || $data === false) {
        error_log("[file/replace] Invalid input.");
        return -50201;
    }

    $file = findFile($fileId);
    if ($file === false) {
        error_log("[file/replace] File #{$fileId} does not exist.");
        return -50202;
    }

    $user = $_SESSION["USER"];
    if ($file["user"] !== $user["id"]) {
        error_log("[file/replace] User \"{$user["login"]}\" is not the owner of file #{$fileId}.");
        return -50203;
    }

    if (isFileNameUsed($file["classroom"], $name, $fileId)) {
        error_log("[file/replace] Another file is already called \"$name\" in class room #{$file["classroom"]}.");
        return -50204;
    }

    if ($data["mime"] !== $file["mime"]) {
        error_log("[file/replace] Mime type mismatch for file #{$fileId}: \"{$data["mime"]}\" instead of \"{$file["mime"]}\".");
        return -50205;
    }

    $DB->begin();
    try {
        $DB->query(
            "UPDATE `{$DB->table("files")}` SET `name` = ?, `size` = ? WHERE `id` = ?",
            $name,
            strlen($data["content"]),
            $fileId
        );
    } catch (Exception $exception) {
        $DB->rollback();
        if (isDuplicateKeyError($exception)) {
            error_log("[file/replace] Another file is already called \"$name\" in class room #{$file["classroom"]}.");
            return -50204;
        }
        error_log("[file/replace] Database error: " . $exception->getMessage());
        return -50206;
    }

    $oldPath = getFilePath($fileId, $file["name"]);
    $newPath = getFilePath($fileId, $name);
    if (!writeFileContent($newPath, $data["content"])) {
        $DB->rollback();
        return -50207;
    }
    $DB->commit();

    // The extension may have changed.
    if ($oldPath !== $newPath) {
        deleteFileContent($oldPath);
    }

    return ["fileId" => $fileId];
}

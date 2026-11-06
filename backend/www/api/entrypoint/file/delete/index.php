<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../file.php";

$ROLE = "teacher";

/**
 * Permanently delete a file of a class room owned by the current user.
 *
 * @param mixed $input
 * ```ts
 * {
 *   fileId: number // Field `id` of table `files`.
 * }
 * ```
 * @return mixed `true` in case of success. Otherwise:
 * * -50301: Invalid input.
 * * -50302: There is no file with this ID.
 * * -50303: You are not the owner of the class room of this file.
 * * -50304: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $fileId = $input["fileId"] ?? null;
    if (!is_int($fileId)) {
        error_log("[file/delete] Invalid input: missing `fileId`.");
        return -50301;
    }

    $file = findFile($fileId);
    if ($file === false) {
        error_log("[file/delete] File #{$fileId} does not exist.");
        return -50302;
    }

    $user = $_SESSION["USER"];
    if ($file["user"] !== $user["id"]) {
        error_log("[file/delete] User \"{$user["login"]}\" is not the owner of file #{$fileId}.");
        return -50303;
    }

    try {
        $stmt = $DB->query("DELETE FROM `{$DB->table("files")}` WHERE `id` = ?", $fileId);
    } catch (Exception $exception) {
        error_log("[file/delete] Database error: " . $exception->getMessage());
        return -50304;
    }

    if ($stmt === false) {
        error_log("[file/delete] Failed to delete file #{$fileId}.");
        return -50304;
    }

    deleteFileContent(getFilePath($fileId, $file["name"]));

    return true;
}

<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../file.php";

$ROLE = "teacher";

/**
 * Send the content of a file of a class room owned by the current user.
 * It is meant to be the target of a link, so the ID can be passed in the query string:
 * `api/file/get?fileId=47211`.
 *
 * @param mixed $input
 * ```ts
 * {
 *   fileId: number // Field `id` of table `files`.
 * }
 * ```
 * @return mixed In case of success, the content of the file is sent
 * and the script stops. Otherwise (with the matching HTTP status):
 * * -50501: Invalid input.
 * * -50502: There is no file with this ID.
 * * -50503: You are not the owner of the class room of this file.
 * * -50504: The content of the file is missing on the server (reported in the logs).
 */
function entrypoint($input)
{
    $fileId = $input["fileId"] ?? $_GET["fileId"] ?? null;
    if (is_string($fileId) && ctype_digit($fileId)) {
        $fileId = (int) $fileId;
    }
    if (!is_int($fileId)) {
        error_log("[file/get] Invalid input: missing `fileId`.");
        http_response_code(400);
        return -50501;
    }

    $file = findFile($fileId);
    if ($file === false) {
        error_log("[file/get] File #{$fileId} does not exist.");
        http_response_code(404);
        return -50502;
    }

    $user = $_SESSION["USER"];
    if ($file["user"] !== $user["id"]) {
        error_log("[file/get] User \"{$user["login"]}\" is not the owner of file #{$fileId}.");
        http_response_code(403);
        return -50503;
    }

    $path = getFilePath($fileId, $file["name"]);
    if (!is_file($path)) {
        error_log("[file/get] Missing content for file #{$fileId}: \"$path\".");
        http_response_code(404);
        return -50504;
    }

    // The content can change with `file/replace` while keeping the same ID.
    sendFileContent($path, $file["name"], $file["mime"]);
}

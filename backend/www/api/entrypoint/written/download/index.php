<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "teacher";

/**
 * Send the content of a file uploaded by a student, for a class room owned by the current user.
 * It is meant to be the target of a link, so the ID can be passed in the query string:
 * `api/written/download?uploadId=123`.
 * The name of the file is `{nickname}.{name}.{hash}.{ext}` (see `getUploadDownloadName()`).
 *
 * @param mixed $input
 * ```ts
 * {
 *   uploadId: number // Field `id` of table `written_upload`.
 * }
 * ```
 * @return mixed In case of success, the content of the file is sent
 * and the script stops. Otherwise (with the matching HTTP status):
 * * -61101: Invalid input.
 * * -61102: There is no uploaded file with this ID.
 * * -61103: You are not the owner of the class room of this file.
 * * -61104: The content of the file is missing on the server (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $uploadId = $input["uploadId"] ?? $_GET["uploadId"] ?? null;
    if (is_string($uploadId) && ctype_digit($uploadId)) {
        $uploadId = (int) $uploadId;
    }
    if (!is_int($uploadId)) {
        error_log("[written/download] Invalid input: missing `uploadId`.");
        http_response_code(400);
        return -61101;
    }

    $stmt = $DB->query(
        "SELECT `u`.*, `c`.`user` AS `owner` FROM `{$DB->table("written_upload")}` AS `u`
         JOIN `{$DB->table("written_assignment")}` AS `a` ON `a`.`id` = `u`.`assignment`
         JOIN `{$DB->table("class")}` AS `c` ON `c`.`id` = `a`.`classroom`
         WHERE `u`.`id` = ? AND `u`.`complete` = 1",
        $uploadId
    );
    $upload = $stmt === false ? false : $stmt->fetch();
    if ($upload === false) {
        error_log("[written/download] Upload #{$uploadId} does not exist.");
        http_response_code(404);
        return -61102;
    }

    $user = $_SESSION["USER"];
    if ((int) $upload["owner"] !== $user["id"]) {
        error_log("[written/download] User \"{$user["login"]}\" is not the owner of upload #{$uploadId}.");
        http_response_code(403);
        return -61103;
    }

    $path = getUploadPath($uploadId, $upload["ext"]);
    if (!is_file($path)) {
        error_log("[written/download] Missing content for upload #{$uploadId}: \"$path\".");
        http_response_code(404);
        return -61104;
    }

    sendFileContent(
        $path,
        getUploadDownloadName($upload["nickname"], $upload["slot"], $upload["computer"], $upload["ext"]),
        $upload["mime"]
    );
}

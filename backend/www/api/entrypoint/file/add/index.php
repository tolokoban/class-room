<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../activity.php";
require_once __DIR__ . "/../../../class.php";
require_once __DIR__ . "/../../../file.php";

$ROLE = "teacher";

/**
 * Upload a new file in a class room owned by the current user.
 * The name must not be used by another file of this class room
 * (use `file/replace` to replace an existing file).
 *
 * @param mixed $input
 * ```ts
 * {
 *   classroomCode: string // Field `code` of table `class`.
 *   name: string // Name of the file, with its extension. Any folder is removed.
 *   file: string // Content of the file as a base64 data URL: "data:<mime>;base64,<content>".
 * }
 * ```
 * @return mixed In case of success: `{ fileId: number }`. Otherwise:
 * * -50101: Invalid input.
 * * -50102: There is no class room with this code.
 * * -50103: You are not the owner of this class room.
 * * -50104: There is already a file with this name in this class room.
 * * -50105: Database error (reported in the logs).
 * * -50106: Unable to store the file on the server (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $classroomCode = $input["classroomCode"] ?? null;
    $name = sanitizeFileName($input["name"] ?? null);
    $data = parseDataUrl($input["file"] ?? null);
    if (!isNonEmptyString($classroomCode) || $name === false || $data === false) {
        error_log("[file/add] Invalid input.");
        return -50101;
    }

    $class = findClassByCode($classroomCode);
    if ($class === false) {
        error_log("[file/add] Class room \"$classroomCode\" does not exist.");
        return -50102;
    }

    $user = $_SESSION["USER"];
    if ($class["user"] !== $user["id"]) {
        error_log("[file/add] User \"{$user["login"]}\" is not the owner of class room \"$classroomCode\".");
        return -50103;
    }

    if (isFileNameUsed($class["id"], $name)) {
        error_log("[file/add] File \"$name\" already exists in class room \"$classroomCode\".");
        return -50104;
    }

    $DB->begin();
    try {
        $DB->query(
            "INSERT INTO `{$DB->table("files")}` (`classroom`, `name`, `size`, `mime`) VALUES (?, ?, ?, ?)",
            $class["id"],
            $name,
            strlen($data["content"]),
            $data["mime"]
        );
        $fileId = (int) $DB->lastId();
    } catch (Exception $exception) {
        $DB->rollback();
        if (isDuplicateKeyError($exception)) {
            error_log("[file/add] File \"$name\" already exists in class room \"$classroomCode\".");
            return -50104;
        }
        error_log("[file/add] Database error: " . $exception->getMessage());
        return -50105;
    }

    if (!writeFileContent(getFilePath($fileId, $name), $data["content"])) {
        $DB->rollback();
        return -50106;
    }
    $DB->commit();

    return ["fileId" => $fileId];
}

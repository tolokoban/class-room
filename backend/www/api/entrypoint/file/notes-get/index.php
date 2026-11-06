<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../activity.php";
require_once __DIR__ . "/../../../file.php";

$ROLE = "teacher";

/**
 * Get the Markdown notes of a class room owned by the current user.
 * They are stored as the file `NOTES_FILE_NAME` of this class room.
 *
 * @param mixed $input
 * ```ts
 * {
 *   classroomCode: string // Field `code` of table `class`.
 * }
 * ```
 * @return mixed In case of success, the Markdown content (`""` if there are no notes yet).
 * Otherwise:
 * * -50601: Invalid input.
 * * -50602: There is no class room with this code.
 * * -50603: You are not the owner of this class room.
 * * -50604: The content of the notes is missing on the server (reported in the logs).
 */
function entrypoint($input)
{
    $classroomCode = $input["classroomCode"] ?? null;
    if (!isNonEmptyString($classroomCode)) {
        error_log("[file/notes-get] Invalid input.");
        return -50601;
    }

    $class = findClassByCode($classroomCode);
    if ($class === false) {
        error_log("[file/notes-get] Class room \"$classroomCode\" does not exist.");
        return -50602;
    }

    $user = $_SESSION["USER"];
    if ($class["user"] !== $user["id"]) {
        error_log("[file/notes-get] User \"{$user["login"]}\" is not the owner of class room \"$classroomCode\".");
        return -50603;
    }

    $notes = findNotesFile($class["id"]);
    if ($notes === false) {
        return "";
    }

    $path = getFilePath($notes["id"], $notes["name"]);
    $content = is_file($path) ? file_get_contents($path) : false;
    if ($content === false) {
        error_log("[file/notes-get] Missing content for the notes of class room \"$classroomCode\": \"$path\".");
        return -50604;
    }

    return $content;
}

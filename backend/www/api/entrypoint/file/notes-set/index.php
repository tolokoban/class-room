<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../activity.php";
require_once __DIR__ . "/../../../file.php";

$ROLE = "teacher";

/**
 * Save the Markdown notes of a class room owned by the current user.
 * They are stored as the file `NOTES_FILE_NAME` of this class room,
 * which is created the first time.
 *
 * @param mixed $input
 * ```ts
 * {
 *   classroomCode: string // Field `code` of table `class`.
 *   content: string // Markdown.
 * }
 * ```
 * @return int
 * * 0: Notes saved.
 * * -50701: Invalid input.
 * * -50702: There is no class room with this code.
 * * -50703: You are not the owner of this class room.
 * * -50704: Database error (reported in the logs).
 * * -50705: Unable to store the notes on the server (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $classroomCode = $input["classroomCode"] ?? null;
    $content = $input["content"] ?? null;
    if (!isNonEmptyString($classroomCode) || !is_string($content)) {
        error_log("[file/notes-set] Invalid input.");
        return -50701;
    }

    $class = findClassByCode($classroomCode);
    if ($class === false) {
        error_log("[file/notes-set] Class room \"$classroomCode\" does not exist.");
        return -50702;
    }

    $user = $_SESSION["USER"];
    if ($class["user"] !== $user["id"]) {
        error_log("[file/notes-set] User \"{$user["login"]}\" is not the owner of class room \"$classroomCode\".");
        return -50703;
    }

    $DB->begin();
    try {
        $notes = findNotesFile($class["id"]);
        if ($notes === false) {
            $DB->query(
                "INSERT INTO `{$DB->table("files")}` (`classroom`, `name`, `size`, `mime`) VALUES (?, ?, ?, ?)",
                $class["id"],
                NOTES_FILE_NAME,
                strlen($content),
                NOTES_MIME
            );
            $notesId = (int) $DB->lastId();
        } else {
            $notesId = $notes["id"];
            $DB->query(
                "UPDATE `{$DB->table("files")}` SET `size` = ? WHERE `id` = ?",
                strlen($content),
                $notesId
            );
        }
    } catch (Exception $exception) {
        $DB->rollback();
        error_log("[file/notes-set] Database error: " . $exception->getMessage());
        return -50704;
    }

    if (!writeFileContent(getFilePath($notesId, NOTES_FILE_NAME), $content)) {
        $DB->rollback();
        return -50705;
    }
    $DB->commit();

    return 0;
}

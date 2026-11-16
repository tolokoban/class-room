<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../class.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "teacher";

/**
 * Create a new written production owned by the current user.
 * Its name must be unique among the written productions of this user.
 *
 * @param mixed $input
 * ```ts
 * {
 *   name: string // Not empty.
 *   description: string // Markdown.
 *   duration: number // Minutes, between 1 and 1440.
 *   expiration?: number // Hours, between 1 and 8760 (default to 24).
 *   // Between 1 and 20 files, with unique names.
 *   // An empty `mimeTypes` accepts any type of file.
 *   files: Array<{ name: string, mimeTypes: string[], maxSize: number }>
 * }
 * ```
 * @return int In case of success, the ID of the new written production. Otherwise:
 * * -60201: Invalid input.
 * * -60202: You already have a written production with this name.
 * * -60203: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $data = parseWrittenInput($input);
    if ($data === false) {
        error_log("[written/add] Invalid input.");
        return -60201;
    }

    $user = $_SESSION["USER"];
    try {
        $stmt = $DB->query(
            "INSERT INTO `{$DB->table("written")}` (`user`, `name`, `description`, `duration`, `expiration`, `files`)
             VALUES (?, ?, ?, ?, ?, ?)",
            $user["id"],
            $data["name"],
            $data["description"],
            $data["duration"],
            $data["expiration"],
            json_encode($data["files"])
        );
    } catch (Exception $exception) {
        if (isDuplicateKeyError($exception)) {
            error_log("[written/add] Name \"{$data["name"]}\" is already used.");
            return -60202;
        }
        error_log("[written/add] Database error: " . $exception->getMessage());
        return -60203;
    }
    if ($stmt === false) {
        return -60203;
    }

    return (int) $DB->lastId();
}

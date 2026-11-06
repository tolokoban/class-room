<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../activity.php";
require_once __DIR__ . "/../../../file.php";

$ROLE = "teacher";

/**
 * List the files of a class room owned by the current user, sorted by name.
 * The notes of the class room (`NOTES_FILE_NAME`) are not listed.
 *
 * @param mixed $input
 * ```ts
 * {
 *   classroomCode: string // Field `code` of table `class`.
 * }
 * ```
 * @return mixed In case of success:
 * ```ts
 * Array<{
 *   id: number
 *   name: string
 *   size: number // In bytes.
 *   mime: string
 * }>
 * ```
 * Otherwise:
 * * -50401: Invalid input.
 * * -50402: There is no class room with this code.
 * * -50403: You are not the owner of this class room.
 */
function entrypoint($input)
{
    global $DB;

    $classroomCode = $input["classroomCode"] ?? null;
    if (!isNonEmptyString($classroomCode)) {
        error_log("[file/list] Invalid input.");
        return -50401;
    }

    $class = findClassByCode($classroomCode);
    if ($class === false) {
        error_log("[file/list] Class room \"$classroomCode\" does not exist.");
        return -50402;
    }

    $user = $_SESSION["USER"];
    if ($class["user"] !== $user["id"]) {
        error_log("[file/list] User \"{$user["login"]}\" is not the owner of class room \"$classroomCode\".");
        return -50403;
    }

    $stmt = $DB->query(
        "SELECT `id`, `name`, `size`, `mime` FROM `{$DB->table("files")}`
         WHERE `classroom` = ? AND `name` <> ? ORDER BY `name`",
        $class["id"],
        NOTES_FILE_NAME
    );
    $rows = $stmt === false ? [] : $stmt->fetchAll();

    return array_map(fn($row) => [
        "id" => (int) $row["id"],
        "name" => $row["name"],
        "size" => (int) $row["size"],
        "mime" => $row["mime"],
    ], $rows);
}

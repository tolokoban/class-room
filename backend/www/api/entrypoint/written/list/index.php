<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "teacher";

/**
 * List the written productions of the current user, sorted by name.
 *
 * @param null $input Ignored.
 * @return mixed
 * ```ts
 * Array<{
 *   id: number
 *   name: string
 *   description: string // Markdown.
 *   duration: number // Minutes.
 *   expiration: number // Hours.
 *   files: Array<{ name: string, mimeTypes: string[], maxSize: number }>
 *   attachments: Array<{ id: number, name: string, mime: string, size: number }> // See `written/attachment-get`.
 *   // Codes of the class rooms this written production is assigned to.
 *   classrooms: string[]
 *   // Number of uploaded files for each expected file (all the class rooms together).
 *   uploads: Record<string, number>
 * }>
 * ```
 */
function entrypoint($input)
{
    global $DB;

    $user = $_SESSION["USER"];
    $stmt = $DB->query(
        "SELECT `id`, `user`, `name`, `description`, `duration`, `expiration`, `files`
         FROM `{$DB->table("written")}` WHERE `user` = ? ORDER BY `name`",
        $user["id"]
    );
    $rows = $stmt === false ? [] : $stmt->fetchAll();

    $classrooms = [];
    $stmt = $DB->query(
        "SELECT `a`.`written`, `c`.`code` FROM `{$DB->table("written_assignment")}` AS `a`
         JOIN `{$DB->table("class")}` AS `c` ON `c`.`id` = `a`.`classroom`
         WHERE `c`.`user` = ? ORDER BY `c`.`code`",
        $user["id"]
    );
    foreach ($stmt === false ? [] : $stmt->fetchAll() as $row) {
        $classrooms[(int) $row["written"]][] = $row["code"];
    }

    $uploads = [];
    $stmt = $DB->query(
        "SELECT `a`.`written`, `u`.`slot`, COUNT(*) AS `n` FROM `{$DB->table("written_upload")}` AS `u`
         JOIN `{$DB->table("written_assignment")}` AS `a` ON `a`.`id` = `u`.`assignment`
         JOIN `{$DB->table("written")}` AS `w` ON `w`.`id` = `a`.`written`
         WHERE `w`.`user` = ? AND `u`.`complete` = 1
         GROUP BY `a`.`written`, `u`.`slot`",
        $user["id"]
    );
    foreach ($stmt === false ? [] : $stmt->fetchAll() as $row) {
        $uploads[(int) $row["written"]][$row["slot"]] = (int) $row["n"];
    }

    return array_map(function ($row) use ($classrooms, $uploads) {
        $written = getWrittenInfos(formatWritten($row));
        $written["classrooms"] = $classrooms[$written["id"]] ?? [];
        // An empty PHP array would be encoded as `[]` instead of `{}`.
        $written["uploads"] = (object) ($uploads[$written["id"]] ?? []);
        return $written;
    }, $rows);
}

<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "teacher";

/**
 * List the written productions assigned to a class room owned by the current user,
 * sorted by position (see `written/reorder`), with the state of their timer and the size of the uploaded files.
 *
 * @param mixed $input
 * ```ts
 * {
 *   classroomCode: string // Field `code` of table `class`.
 * }
 * ```
 * @return mixed In case of success:
 * ```ts
 * {
 *   // Current UNIX timestamp of the server (seconds).
 *   now: number
 *   items: Array<{
 *     id: number // Field `id` of table `written`.
 *     name: string
 *     timer: Timer // See `getTimer()` in `written.php`.
 *     count: number // Number of uploaded files.
 *     size: number // Total size of the uploaded files, in bytes.
 *   }>
 * }
 * ```
 * Otherwise:
 * * -60701: Invalid input.
 * * -60702: There is no class room with this code.
 * * -60703: You are not the owner of this class room.
 */
function entrypoint($input)
{
    global $DB;

    $class = resolveOwnedClass($input["classroomCode"] ?? null, 60700, "written/classroom");
    if (is_int($class)) {
        return $class;
    }

    collectWrittenGarbage();
    $stmt = $DB->query(
        "SELECT `a`.*, `w`.`name`,
            (SELECT COUNT(*) FROM `{$DB->table("written_upload")}` AS `u`
             WHERE `u`.`assignment` = `a`.`id` AND `u`.`complete` = 1) AS `count`,
            (SELECT COALESCE(SUM(`u`.`size`), 0) FROM `{$DB->table("written_upload")}` AS `u`
             WHERE `u`.`assignment` = `a`.`id` AND `u`.`complete` = 1) AS `size`
         FROM `{$DB->table("written_assignment")}` AS `a`
         JOIN `{$DB->table("written")}` AS `w` ON `w`.`id` = `a`.`written`
         WHERE `a`.`classroom` = ? ORDER BY `a`.`position`, `a`.`id`",
        $class["id"]
    );
    $rows = $stmt === false ? [] : $stmt->fetchAll();

    return [
        "now" => time(),
        "items" => array_map(fn($row) => [
            "id" => (int) $row["written"],
            "name" => $row["name"],
            "timer" => getTimer(formatAssignment($row)),
            "count" => (int) $row["count"],
            "size" => (int) $row["size"],
        ], $rows),
    ];
}

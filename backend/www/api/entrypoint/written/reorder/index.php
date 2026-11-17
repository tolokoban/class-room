<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "teacher";

/**
 * Change the order of the written productions assigned to a class room.
 *
 * @param mixed $input
 * ```ts
 * {
 *   classroomCode: string // Field `code` of table `class`.
 *   // IDs (field `id` of table `written`) of all the written productions
 *   // assigned to this class room, in the new order.
 *   writtenIds: number[]
 * }
 * ```
 * @return int
 * * 0: Success.
 * * -61801: Invalid input.
 * * -61802: There is no class room with this code.
 * * -61803: You are not the owner of this class room.
 * * -61804: `writtenIds` does not match the written productions assigned to this class room.
 * * -61805: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $writtenIds = $input["writtenIds"] ?? null;
    if (!is_array($writtenIds) || !array_is_list($writtenIds)) {
        error_log("[written/reorder] Invalid input: `writtenIds`.");
        return -61801;
    }
    foreach ($writtenIds as $id) {
        if (!is_int($id)) {
            error_log("[written/reorder] Invalid input: `writtenIds` must contain only integers.");
            return -61801;
        }
    }
    $class = resolveOwnedClass($input["classroomCode"] ?? null, 61800, "written/reorder");
    if (is_int($class)) {
        return $class;
    }

    $stmt = $DB->query(
        "SELECT `written` FROM `{$DB->table("written_assignment")}` WHERE `classroom` = ?",
        $class["id"]
    );
    $assigned = $stmt === false ? [] : array_map("intval", $stmt->fetchAll(PDO::FETCH_COLUMN));
    $expected = $assigned;
    $received = $writtenIds;
    sort($expected);
    sort($received);
    if ($expected !== $received) {
        error_log("[written/reorder] The IDs do not match the written productions of class room #{$class["id"]}.");
        return -61804;
    }

    $DB->begin();
    try {
        foreach ($writtenIds as $index => $writtenId) {
            $DB->query(
                "UPDATE `{$DB->table("written_assignment")}` SET `position` = ? WHERE `classroom` = ? AND `written` = ?",
                $index + 1,
                $class["id"],
                $writtenId
            );
        }
    } catch (Exception $exception) {
        $DB->rollback();
        error_log("[written/reorder] Database error: " . $exception->getMessage());
        return -61805;
    }
    $DB->commit();

    return 0;
}

<?php
require_once __DIR__ . "/../../../db.php";

$ROLE = "teacher";

/**
 * Delete a class room owned by the current user.
 *
 * @param mixed $input
 * ```ts
 * {
 *   id: number // Field `id` of table `class`.
 * }
 * ```
 * @return int
 * * 0: Deletion successful.
 * * -20401: Invalid input.
 * * -20402: There is no class room with this ID.
 * * -20403: You are not the owner of this class room.
 * * -20404: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $id = $input["id"] ?? null;
    if (!is_int($id)) {
        error_log("[class/delete] Invalid input: missing `id`.");
        return -20401;
    }

    $stmt = $DB->query("SELECT `user` FROM `{$DB->table("class")}` WHERE `id` = ?", $id);
    $row = $stmt === false ? false : $stmt->fetch();
    if ($row === false) {
        error_log("[class/delete] Class room #{$id} does not exist.");
        return -20402;
    }

    $user = $_SESSION["USER"];
    if ((int) $row["user"] !== $user["id"]) {
        error_log("[class/delete] User \"{$user["login"]}\" is not the owner of class room #{$id}.");
        return -20403;
    }

    try {
        $stmt = $DB->query("DELETE FROM `{$DB->table("class")}` WHERE `id` = ?", $id);
    } catch (Exception $exception) {
        error_log("[class/delete] Database error: " . $exception->getMessage());
        return -20404;
    }

    if ($stmt === false) {
        error_log("[class/delete] Failed to delete class room #{$id}.");
        return -20404;
    }

    return 0;
}

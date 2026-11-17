<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "teacher";

/**
 * Delete a written production owned by the current user,
 * with its assignments, its attachments and all the files uploaded by the students.
 * If it is the current activity of a class room, this class room has no current activity anymore.
 *
 * @param mixed $input
 * ```ts
 * {
 *   id: number // Field `id` of table `written`.
 * }
 * ```
 * @return int
 * * 0: Deletion successful.
 * * -60401: Invalid input.
 * * -60402: There is no written production with this ID.
 * * -60403: You are not the owner of this written production.
 * * -60404: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $written = resolveOwnedWritten($input["id"] ?? null, 60400, "written/delete");
    if (is_int($written)) {
        return $written;
    }

    try {
        deleteUploads("`a`.`written` = ?", $written["id"]);
        deleteAttachments("`written` = ?", $written["id"]);
        $DB->query(
            "UPDATE `{$DB->table("class")}` SET `activity` = NULL WHERE `user` = ? AND `activity` = ?",
            $written["user"],
            WRITTEN_ACTIVITY_PREFIX . $written["id"]
        );
        $stmt = $DB->query("DELETE FROM `{$DB->table("written")}` WHERE `id` = ?", $written["id"]);
    } catch (Exception $exception) {
        error_log("[written/delete] Database error: " . $exception->getMessage());
        return -60404;
    }

    return $stmt === false ? -60404 : 0;
}

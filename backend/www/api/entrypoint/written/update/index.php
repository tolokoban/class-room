<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../class.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "teacher";

/**
 * Update a written production owned by the current user.
 *
 * The expected files are identified by their name: if an expected file is removed
 * or renamed, all the files uploaded for it (in every class room) are deleted.
 * Changing the mime types or the max size of an expected file keeps its uploads.
 *
 * @param mixed $input
 * ```ts
 * {
 *   id: number // Field `id` of table `written`.
 *   name: string
 *   description: string
 *   duration: number
 *   expiration: number
 *   files: Array<{ name: string, mimeTypes: string[], maxSize: number }>
 * }
 * ```
 * See `written/add` for the constraints.
 * @return mixed In case of success: `{ deleted: number }` (number of deleted uploads). Otherwise:
 * * -60301: Invalid input.
 * * -60302: There is no written production with this ID.
 * * -60303: You are not the owner of this written production.
 * * -60304: You already have another written production with this name.
 * * -60305: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $data = parseWrittenInput($input);
    if ($data === false) {
        error_log("[written/update] Invalid input.");
        return -60301;
    }
    $written = resolveOwnedWritten($input["id"] ?? null, 60300, "written/update");
    if (is_int($written)) {
        return $written;
    }

    $newNames = array_map(fn($file) => $file["name"], $data["files"]);
    $removed = array_values(array_filter(
        array_map(fn($file) => $file["name"], $written["files"]),
        fn($name) => !in_array($name, $newNames, true)
    ));

    try {
        $stmt = $DB->query(
            "UPDATE `{$DB->table("written")}`
             SET `name` = ?, `description` = ?, `duration` = ?, `expiration` = ?, `files` = ?
             WHERE `id` = ?",
            $data["name"],
            $data["description"],
            $data["duration"],
            $data["expiration"],
            json_encode($data["files"]),
            $written["id"]
        );
        if ($stmt === false) {
            return -60305;
        }
        $deleted = 0;
        foreach ($removed as $slot) {
            $deleted += deleteUploads("`a`.`written` = ? AND `u`.`slot` = ?", $written["id"], $slot);
        }
        // The expiration may have changed.
        $DB->query(
            "UPDATE `{$DB->table("written_assignment")}`
             SET `expires_at` = `end_time` + 3600 * (? + `extension`)
             WHERE `written` = ? AND `end_time` IS NOT NULL",
            $data["expiration"],
            $written["id"]
        );
    } catch (Exception $exception) {
        if (isDuplicateKeyError($exception)) {
            error_log("[written/update] Name \"{$data["name"]}\" is already used.");
            return -60304;
        }
        error_log("[written/update] Database error: " . $exception->getMessage());
        return -60305;
    }

    return ["deleted" => $deleted];
}

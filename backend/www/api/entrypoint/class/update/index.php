<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../class.php";

$ROLE = "teacher";

/**
 * Update an existing class room owned by the current user.
 * Only the given fields are updated.
 *
 * @param mixed $input
 * ```ts
 * {
 *   id: number // Field `id` of table `class`.
 *   code?: string // Not empty, and unique in the whole database.
 *   name?: string // Not empty.
 *   description?: string
 * }
 * ```
 * @return int
 * * 0: Update successful.
 * * -20301: Invalid input.
 * * -20302: There is no class room with this ID.
 * * -20303: You are not the owner of this class room.
 * * -20304: This code is already used by another class room.
 * * -20305: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $id = is_array($input) ? ($input["id"] ?? null) : null;
    if (!is_int($id)) {
        error_log("[class/update] Invalid input: missing `id`.");
        return -20301;
    }

    $fields = [];
    foreach (["code", "name", "description"] as $key) {
        if (!array_key_exists($key, $input)) {
            continue;
        }
        $value = $input[$key];
        if (!is_string($value)) {
            error_log("[class/update] Invalid input: `$key` must be a string.");
            return -20301;
        }
        if ($key !== "description") {
            $value = trim($value);
            if ($value === "") {
                error_log("[class/update] Invalid input: `$key` must not be empty.");
                return -20301;
            }
        }
        $fields[$key] = $value;
    }

    $stmt = $DB->query("SELECT `user` FROM `{$DB->table("class")}` WHERE `id` = ?", $id);
    $row = $stmt === false ? false : $stmt->fetch();
    if ($row === false) {
        error_log("[class/update] Class room #{$id} does not exist.");
        return -20302;
    }

    $user = $_SESSION["USER"];
    if ((int) $row["user"] !== $user["id"]) {
        error_log("[class/update] User \"{$user["login"]}\" is not the owner of class room #{$id}.");
        return -20303;
    }

    if (count($fields) === 0) {
        return 0;
    }

    if (isset($fields["code"]) && isClassCodeUsed($fields["code"], $id)) {
        error_log("[class/update] Code \"{$fields["code"]}\" is already used.");
        return -20304;
    }

    $assignments = implode(", ", array_map(fn($key) => "`$key` = ?", array_keys($fields)));
    try {
        $stmt = $DB->query(
            "UPDATE `{$DB->table("class")}` SET $assignments WHERE `id` = ?",
            ...[...array_values($fields), $id]
        );
    } catch (Exception $exception) {
        if (isDuplicateKeyError($exception)) {
            error_log("[class/update] Code \"{$fields["code"]}\" is already used.");
            return -20304;
        }
        error_log("[class/update] Database error: " . $exception->getMessage());
        return -20305;
    }

    if ($stmt === false) {
        error_log("[class/update] Failed to update class room #{$id}.");
        return -20305;
    }

    return 0;
}

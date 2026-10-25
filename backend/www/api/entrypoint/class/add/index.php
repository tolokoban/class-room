<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../class.php";

$ROLE = "teacher";

/**
 * Create a new class room (table `class`) owned by the current user.
 * The `code` must be unique in the whole database.
 *
 * @param mixed $input
 * ```ts
 * {
 *   code: string // The code to give the students to access the class (not empty).
 *   name: string // Not empty.
 *   description?: string // Markdown description (default to "").
 * }
 * ```
 * @return int In case of success, the ID of the new class room. Otherwise:
 * * -20101: Invalid input.
 * * -20102: This code is already used by another class room.
 * * -20103: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $code = $input["code"] ?? null;
    $name = $input["name"] ?? null;
    $description = $input["description"] ?? "";

    if (
        !is_string($code) || trim($code) === ""
        || !is_string($name) || trim($name) === ""
        || !is_string($description)
    ) {
        error_log("[class/add] Invalid input.");
        return -20101;
    }
    $code = trim($code);
    $name = trim($name);

    if (isClassCodeUsed($code)) {
        error_log("[class/add] Code \"$code\" is already used.");
        return -20102;
    }

    $user = $_SESSION["USER"];
    try {
        $stmt = $DB->query(
            "INSERT INTO `{$DB->table("class")}` (`user`, `code`, `name`, `description`) VALUES (?, ?, ?, ?)",
            $user["id"],
            $code,
            $name,
            $description
        );
    } catch (Exception $exception) {
        if (isDuplicateKeyError($exception)) {
            error_log("[class/add] Code \"$code\" is already used.");
            return -20102;
        }
        error_log("[class/add] Database error: " . $exception->getMessage());
        return -20103;
    }

    if ($stmt === false) {
        error_log("[class/add] Failed to insert new class room.");
        return -20103;
    }

    return (int) $DB->lastId();
}

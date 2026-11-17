<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../written.php";

$ROLE = "teacher";

/**
 * Control the timer of a written production in a class room.
 *
 * Actions:
 * * "start": Start the exercise (only if not started yet) for `value` minutes
 *   (the duration of the written production if missing). The students can upload files.
 * * "pause": Pause the timer (only if running). The students can still upload files.
 * * "resume": Restart a paused timer.
 * * "add": Add `value` minutes to the timer (running or paused).
 * * "extend": Add `value` hours before the deletion of the files.
 * * "reset": Back to "not started", and delete all the uploaded files.
 *
 * The files expire `expiration + extension` hours after the end of the exercise.
 * While the timer is paused, the expiration date does not change.
 *
 * @param mixed $input
 * ```ts
 * {
 *   writtenId: number // Field `id` of table `written`.
 *   classroomCode: string // Field `code` of table `class`.
 *   action: "start" | "pause" | "resume" | "add" | "extend" | "reset"
 *   // Minutes for "start" (between 1 and 1440, optional) and "add" (between 1 and 600),
 *   // hours for "extend" (between 1 and 8760).
 *   value?: number
 * }
 * ```
 * @return mixed In case of success, the new state of the timer (see `getTimer()` in `written.php`).
 * Otherwise:
 * * -60801: Invalid input.
 * * -60802: There is no class room with this code.
 * * -60803: You are not the owner of this class room.
 * * -60804: There is no written production with this ID.
 * * -60805: You are not the owner of this written production.
 * * -60806: This written production is not assigned to this class room.
 * * -60807: This action is not possible in the current state of the timer.
 * * -60808: Database error (reported in the logs).
 */
function entrypoint($input)
{
    global $DB;

    $action = $input["action"] ?? null;
    $value = $input["value"] ?? null;
    $limits = ["start" => 24 * 60, "add" => 600, "extend" => 24 * 365];
    $optional = $action === "start" && $value === null;
    if (
        !in_array($action, ["start", "pause", "resume", "add", "extend", "reset"], true)
        || (isset($limits[$action]) && !$optional && (!is_int($value) || $value < 1 || $value > $limits[$action]))
    ) {
        error_log("[written/timer] Invalid input.");
        return -60801;
    }
    $resolved = resolveAssignment($input["writtenId"] ?? null, $input["classroomCode"] ?? null, 60800, "written/timer");
    if (is_int($resolved)) {
        return $resolved;
    }
    ["written" => $written, "assignment" => $assignment] = $resolved;

    $next = computeNextTimer($action, $value, $written, $assignment);
    if ($next === false) {
        error_log("[written/timer] Action \"$action\" is not possible in state \"" . getTimer($assignment)["state"] . "\".");
        return -60807;
    }

    try {
        if ($action === "reset") {
            deleteUploads("`a`.`id` = ?", $assignment["id"]);
        }
        $DB->query(
            "UPDATE `{$DB->table("written_assignment")}`
             SET `end_time` = ?, `remaining` = ?, `extension` = ?, `expires_at` = ? WHERE `id` = ?",
            $next["endTime"],
            $next["remaining"],
            $next["extension"],
            $next["expiresAt"],
            $assignment["id"]
        );
    } catch (Exception $exception) {
        error_log("[written/timer] Database error: " . $exception->getMessage());
        return -60808;
    }

    return getTimer($next);
}

/**
 * @return array|false The assignment after the action, or `false` if the action is not possible.
 */
function computeNextTimer(string $action, $value, array $written, array $assignment)
{
    $now = time();
    $state = getTimer($assignment)["state"];
    $next = $assignment;
    switch ($action) {
        case "start":
            if ($state !== "idle") {
                return false;
            }
            $next["endTime"] = $now + 60 * ($value ?? $written["duration"]);
            break;
        case "pause":
            if ($state !== "running") {
                return false;
            }
            $next["remaining"] = $assignment["endTime"] - $now;
            $next["endTime"] = null;
            return $next;
        case "resume":
            if ($state !== "paused") {
                return false;
            }
            $next["endTime"] = $now + $assignment["remaining"];
            $next["remaining"] = null;
            break;
        case "add":
            if ($state === "idle") {
                return false;
            }
            if ($state === "paused") {
                $next["remaining"] += 60 * $value;
                return $next;
            }
            $next["endTime"] += 60 * $value;
            break;
        case "extend":
            if ($state === "idle") {
                return false;
            }
            $next["extension"] += $value;
            $next["expiresAt"] = $assignment["expiresAt"] === null ? null : $assignment["expiresAt"] + 3600 * $value;
            return $next;
        case "reset":
            return array_merge($assignment, ["endTime" => null, "remaining" => null, "extension" => 0, "expiresAt" => null]);
    }
    $next["expiresAt"] = computeExpiresAt($next["endTime"], $written, $next);
    return $next;
}

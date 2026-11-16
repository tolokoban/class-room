<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../activity.php";
require_once __DIR__ . "/../../../class.php";

$ROLE = "";

/**
 * Remember that a student has just entered a class room.
 *
 * The student takes a seat in the class room (table `seat`). The seat is kept
 * until the teacher frees it (see `room/kick`). A nickname can only be used by one
 * seat of the class room, and the number of seats is limited by `class.max_students`.
 *
 * A student (identified by its `computer`) is only in one class room at a time
 * for table `room`: the previous one is forgotten.
 *
 * @param mixed $input
 * ```ts
 * {
 *   classroomCode: string // Field `code` of table `class`.
 *   computer: string // Unique identifier of the student's computer.
 *   nickname: string // Student's nickname.
 * }
 * ```
 * @return int
 * * 0: Success.
 * * -40101: Invalid input.
 * * -40102: There is no class room with this code.
 * * -40103: Database error (reported in the logs).
 * * -40104: This nickname is already used by another student of this class room.
 * * -40105: The class room is full.
 */
function entrypoint($input)
{
    global $DB;

    $classroomCode = $input["classroomCode"] ?? null;
    $computer = $input["computer"] ?? null;
    $nickname = $input["nickname"] ?? null;

    if (
        !isNonEmptyString($classroomCode)
        || !isNonEmptyString($computer)
        || !isNonEmptyString($nickname)
    ) {
        error_log("[room/enter] Invalid input.");
        return -40101;
    }
    $nickname = trim($nickname);

    $class = findClassByCode($classroomCode);
    if ($class === false) {
        error_log("[room/enter] Class room \"$classroomCode\" does not exist.");
        return -40102;
    }

    try {
        $seatError = takeSeat($class, $computer, $nickname);
        if ($seatError !== 0) {
            return $seatError;
        }
        $stmt = $DB->query(
            "INSERT INTO `{$DB->table("room")}` (`computer`, `nickname`, `classroom`, `time`)
             VALUES (?, ?, ?, NOW())
             ON DUPLICATE KEY UPDATE
                `nickname` = VALUES(`nickname`),
                `classroom` = VALUES(`classroom`),
                `time` = VALUES(`time`)",
            $computer,
            $nickname,
            $class["id"]
        );
    } catch (Exception $exception) {
        if (isDuplicateKeyError($exception)) {
            error_log("[room/enter] Nickname \"$nickname\" is already used.");
            return -40104;
        }
        error_log("[room/enter] Database error: " . $exception->getMessage());
        return -40103;
    }

    if ($stmt === false) {
        error_log("[room/enter] Failed to store the room of \"$nickname\".");
        return -40103;
    }

    return 0;
}

/**
 * Reserve a seat in a class room for this computer, or update the nickname of its seat.
 * @return int 0 on success, or an error code of the entrypoint.
 */
function takeSeat(array $class, string $computer, string $nickname): int
{
    global $DB;

    $stmt = $DB->query(
        "SELECT `computer` FROM `{$DB->table("seat")}` WHERE `classroom` = ? AND `nickname` = ?",
        $class["id"],
        $nickname
    );
    $owner = $stmt === false ? false : $stmt->fetch();
    if ($owner !== false && $owner["computer"] !== $computer) {
        error_log("[room/enter] Nickname \"$nickname\" is already used on another computer.");
        return -40104;
    }

    $stmt = $DB->query(
        "SELECT `computer` FROM `{$DB->table("seat")}` WHERE `classroom` = ? AND `computer` = ?",
        $class["id"],
        $computer
    );
    if ($stmt !== false && $stmt->fetch() !== false) {
        $DB->query(
            "UPDATE `{$DB->table("seat")}` SET `nickname` = ?, `time` = NOW() WHERE `classroom` = ? AND `computer` = ?",
            $nickname,
            $class["id"],
            $computer
        );
        return 0;
    }

    $stmt = $DB->query("SELECT COUNT(*) AS `n` FROM `{$DB->table("seat")}` WHERE `classroom` = ?", $class["id"]);
    $count = $stmt === false ? 0 : (int) $stmt->fetch()["n"];
    if ($count >= $class["maxStudents"]) {
        error_log("[room/enter] Class room #{$class["id"]} is full ({$class["maxStudents"]} students).");
        return -40105;
    }

    $DB->query(
        "INSERT INTO `{$DB->table("seat")}` (`classroom`, `computer`, `nickname`, `time`) VALUES (?, ?, ?, NOW())",
        $class["id"],
        $computer,
        $nickname
    );
    return 0;
}

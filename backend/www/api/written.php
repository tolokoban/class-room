<?php

require_once __DIR__ . "/db.php";
require_once __DIR__ . "/activity.php";
require_once __DIR__ . "/file.php";

/**
 * Generic activities of type "Production écrite" (written productions).
 *
 * A teacher defines written productions (table `written`) and assigns them
 * to class rooms (table `written_assignment`). Each assignment has its own timer.
 * The students upload the expected files (table `written_upload`) by chunks:
 * `written/upload-init`, `written/upload-chunk` and `written/upload-complete`.
 *
 * The content of the uploads is stored in `www/files/written/`, with the same
 * folder structure as the teachers' files (see `getFilePath()`).
 * While being uploaded, the content is in a file with the extension `.part`.
 */
const WRITTEN_ROOT = FILES_ROOT . "/written";

/** The activity code of a written production is "written/{id}". */
const WRITTEN_ACTIVITY_PREFIX = "written/";

/** Maximum size (in bytes) of an expected file. */
const WRITTEN_MAX_FILE_SIZE = 1024 * 1024 * 1024;

/** Maximum size (in bytes) of a decoded chunk. */
const WRITTEN_MAX_CHUNK_SIZE = 1024 * 1024;

/** Incomplete uploads are deleted after this number of seconds without any new chunk. */
const WRITTEN_PENDING_TIMEOUT = 3600;

/** Maximum number of expected files for a written production. */
const WRITTEN_MAX_FILES = 20;

/**
 * Extension to give to a file, depending on its mime type.
 */
const WRITTEN_MIME_EXTENSIONS = [
    "application/pdf" => "pdf",
    "application/msword" => "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" => "docx",
    "application/vnd.oasis.opendocument.text" => "odt",
    "application/rtf" => "rtf",
    "text/rtf" => "rtf",
    "application/vnd.ms-excel" => "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" => "xlsx",
    "application/vnd.oasis.opendocument.spreadsheet" => "ods",
    "text/csv" => "csv",
    "application/vnd.ms-powerpoint" => "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation" => "pptx",
    "application/vnd.oasis.opendocument.presentation" => "odp",
    "image/png" => "png",
    "image/jpeg" => "jpg",
    "image/gif" => "gif",
    "image/webp" => "webp",
    "image/svg+xml" => "svg",
    "text/plain" => "txt",
    "text/markdown" => "md",
    "text/html" => "html",
    "application/zip" => "zip",
    "application/x-zip-compressed" => "zip",
    "application/x-7z-compressed" => "7z",
    "audio/mpeg" => "mp3",
    "audio/ogg" => "ogg",
    "audio/wav" => "wav",
    "video/mp4" => "mp4",
    "video/webm" => "webm",
];

/**
 * Mime types detected by `finfo` for containers or unknown contents.
 * Office documents are ZIP files, for instance. In this case,
 * the mime type given by the browser is used instead.
 */
const WRITTEN_GENERIC_MIMES = [
    "application/zip",
    "application/octet-stream",
    "application/x-empty",
    "application/encrypted",
    "application/CDFV2",
    "application/x-ole-storage",
    "text/plain",
];

/**
 * Check and normalize the list of the expected files of a written production.
 *
 * @return array|false `Array<{ name: string, mimeTypes: string[], maxSize: int }>`,
 * or `false` if the input is invalid.
 */
function parseExpectedFiles($files)
{
    if (!is_array($files) || !array_is_list($files) || count($files) === 0 || count($files) > WRITTEN_MAX_FILES) {
        return false;
    }
    $result = [];
    $names = [];
    foreach ($files as $file) {
        $name = is_array($file) ? ($file["name"] ?? null) : null;
        $mimeTypes = is_array($file) ? ($file["mimeTypes"] ?? []) : null;
        $maxSize = is_array($file) ? ($file["maxSize"] ?? null) : null;
        if (!is_string($name) || !isValidSlotName(trim($name))) {
            return false;
        }
        $name = trim($name);
        $key = mb_strtolower($name);
        if (isset($names[$key])) {
            return false;
        }
        $names[$key] = true;
        if (!is_array($mimeTypes) || !array_is_list($mimeTypes)) {
            return false;
        }
        foreach ($mimeTypes as $mime) {
            if (!is_string($mime) || !preg_match('#^[a-z0-9!\#$&^_.+-]+/[a-z0-9!\#$&^_.+-]+$#', $mime)) {
                return false;
            }
        }
        if (!is_int($maxSize) || $maxSize < 1 || $maxSize > WRITTEN_MAX_FILE_SIZE) {
            return false;
        }
        $result[] = ["name" => $name, "mimeTypes" => array_values(array_unique($mimeTypes)), "maxSize" => $maxSize];
    }
    return $result;
}

/**
 * Check and normalize the definition of a written production (used by `written/add` and `written/update`).
 *
 * @return array|false `["name", "description", "duration", "expiration", "files"]`,
 * or `false` if the input is invalid.
 */
function parseWrittenInput($input)
{
    $name = $input["name"] ?? null;
    $description = $input["description"] ?? "";
    $duration = $input["duration"] ?? null;
    $expiration = $input["expiration"] ?? 24;
    $files = parseExpectedFiles($input["files"] ?? null);
    if (
        !is_string($name) || trim($name) === "" || mb_strlen(trim($name)) > 255
        || !is_string($description)
        || !is_int($duration) || $duration < 1 || $duration > 24 * 60
        || !is_int($expiration) || $expiration < 1 || $expiration > 24 * 365
        || $files === false
    ) {
        return false;
    }
    return [
        "name" => trim($name),
        "description" => $description,
        "duration" => $duration,
        "expiration" => $expiration,
        "files" => $files,
    ];
}

/**
 * The name of an expected file is part of the name of the downloaded files:
 * `{nickname}.{name}.{hash}.{ext}`. So it must be safe in a file name.
 */
function isValidSlotName(string $name): bool
{
    return $name !== ""
        && mb_strlen($name) <= 64
        && !str_starts_with($name, ".")
        && !preg_match('#[\x00-\x1f\x7f/\\\\:*?"<>|]#', $name);
}

/**
 * @return array|false The written production with this ID:
 * `["id", "user", "name", "description", "duration", "expiration", "files"]`,
 * or `false` if it does not exist.
 */
function findWritten(int $id)
{
    global $DB;

    $stmt = $DB->query(
        "SELECT `id`, `user`, `name`, `description`, `duration`, `expiration`, `files`
         FROM `{$DB->table("written")}` WHERE `id` = ?",
        $id
    );
    $row = $stmt === false ? false : $stmt->fetch();
    return $row === false ? false : formatWritten($row);
}

function formatWritten(array $row): array
{
    return [
        "id" => (int) $row["id"],
        "user" => (int) $row["user"],
        "name" => $row["name"],
        "description" => $row["description"],
        "duration" => (int) $row["duration"],
        "expiration" => (int) $row["expiration"],
        "files" => json_decode($row["files"], true) ?? [],
    ];
}

/**
 * @return array|false The assignment of a written production to a class room,
 * or `false` if this production is not assigned to this class room.
 */
function findAssignment(int $writtenId, int $classroomId)
{
    global $DB;

    $stmt = $DB->query(
        "SELECT * FROM `{$DB->table("written_assignment")}` WHERE `written` = ? AND `classroom` = ?",
        $writtenId,
        $classroomId
    );
    $row = $stmt === false ? false : $stmt->fetch();
    return $row === false ? false : formatAssignment($row);
}

function formatAssignment(array $row): array
{
    return [
        "id" => (int) $row["id"],
        "written" => (int) $row["written"],
        "classroom" => (int) $row["classroom"],
        "endTime" => $row["end_time"] === null ? null : (int) $row["end_time"],
        "remaining" => $row["remaining"] === null ? null : (int) $row["remaining"],
        "extension" => (int) $row["extension"],
        "expiresAt" => $row["expires_at"] === null ? null : (int) $row["expires_at"],
    ];
}

/**
 * State of the timer of an assignment, as sent to the frontend.
 *
 * ```ts
 * {
 *   state: "idle" | "running" | "paused"
 *   // UNIX timestamp (seconds) of the end of the exercise, if running.
 *   endTime: number | null
 *   // Seconds left (can be negative), if paused.
 *   remaining: number | null
 *   // UNIX timestamp (seconds) of the deletion of the files, if any.
 *   expiresAt: number | null
 * }
 * ```
 */
function getTimer(array $assignment): array
{
    $state = $assignment["endTime"] !== null
        ? "running"
        : ($assignment["remaining"] !== null ? "paused" : "idle");
    return [
        "state" => $state,
        "endTime" => $assignment["endTime"],
        "remaining" => $assignment["remaining"],
        "expiresAt" => $assignment["expiresAt"],
    ];
}

/**
 * @return int When the files of an assignment must be deleted, if the exercise ends at `$endTime`.
 */
function computeExpiresAt(int $endTime, array $written, array $assignment): int
{
    return $endTime + 3600 * ($written["expiration"] + $assignment["extension"]);
}

/**
 * Is it still possible to upload files for this assignment?
 * @return string|true `true`, or the reason why it is not possible: "idle" or "expired".
 */
function canUpload(array $assignment)
{
    $timer = getTimer($assignment);
    if ($timer["state"] === "idle") {
        return "idle";
    }
    if ($timer["expiresAt"] !== null && $timer["expiresAt"] <= time()) {
        return "expired";
    }
    return true;
}

/**
 * @return array|false The seat of a computer in a class room:
 * `["computer" => string, "nickname" => string]`, or `false` if it has no seat.
 */
function findSeat(int $classroomId, string $computer)
{
    global $DB;

    $stmt = $DB->query(
        "SELECT `computer`, `nickname` FROM `{$DB->table("seat")}` WHERE `classroom` = ? AND `computer` = ?",
        $classroomId,
        $computer
    );
    $row = $stmt === false ? false : $stmt->fetch();
    return $row === false ? false : $row;
}

/**
 * The class room with this code, if the current user owns it.
 *
 * @return array|string The class room (see `findClassByCode()`),
 * or "missing" if it does not exist, or "forbidden" if the current user does not own it.
 */
function findOwnedClass($classroomCode)
{
    $class = findClassByCode($classroomCode);
    if ($class === false) {
        return "missing";
    }
    $user = $_SESSION["USER"] ?? null;
    if ($user === null || $class["user"] !== $user["id"]) {
        return "forbidden";
    }
    return $class;
}

/**
 * The written production with this ID, if the current user owns it.
 *
 * @return array|string The written production (see `findWritten()`),
 * or "missing" if it does not exist, or "forbidden" if the current user does not own it.
 */
function findOwnedWritten($writtenId)
{
    $written = findWritten($writtenId);
    if ($written === false) {
        return "missing";
    }
    $user = $_SESSION["USER"] ?? null;
    if ($user === null || $written["user"] !== $user["id"]) {
        return "forbidden";
    }
    return $written;
}

/**
 * Resolve the class room `$classroomCode` owned by the current user.
 * The error codes are `-($base + n)`, with:
 * * n = 1: Invalid input.
 * * n = 2: There is no class room with this code.
 * * n = 3: You are not the owner of this class room.
 *
 * @return array|int The class room, or an error code.
 */
function resolveOwnedClass($classroomCode, int $base, string $tag)
{
    if (!isNonEmptyString($classroomCode)) {
        error_log("[$tag] Invalid input: `classroomCode`.");
        return -($base + 1);
    }
    $class = findOwnedClass($classroomCode);
    if ($class === "missing") {
        error_log("[$tag] Class room \"$classroomCode\" does not exist.");
        return -($base + 2);
    }
    if ($class === "forbidden") {
        error_log("[$tag] You are not the owner of class room \"$classroomCode\".");
        return -($base + 3);
    }
    return $class;
}

/**
 * Resolve the written production `$writtenId` owned by the current user.
 * The error codes are `-($base + n)`, with:
 * * n = 1: Invalid input.
 * * n = 2: There is no written production with this ID.
 * * n = 3: You are not the owner of this written production.
 *
 * @return array|int The written production, or an error code.
 */
function resolveOwnedWritten($writtenId, int $base, string $tag)
{
    if (!is_int($writtenId)) {
        error_log("[$tag] Invalid input: `writtenId`.");
        return -($base + 1);
    }
    $written = findOwnedWritten($writtenId);
    if ($written === "missing") {
        error_log("[$tag] Written production #$writtenId does not exist.");
        return -($base + 2);
    }
    if ($written === "forbidden") {
        error_log("[$tag] You are not the owner of written production #$writtenId.");
        return -($base + 3);
    }
    return $written;
}

/**
 * Resolve the assignment of a written production to a class room, both owned by the current user.
 * The error codes are `-($base + n)`, with:
 * * n = 1: Invalid input.
 * * n = 2: There is no class room with this code.
 * * n = 3: You are not the owner of this class room.
 * * n = 4: There is no written production with this ID.
 * * n = 5: You are not the owner of this written production.
 * * n = 6: This written production is not assigned to this class room.
 *
 * @return array|int `["class" => array, "written" => array, "assignment" => array]`, or an error code.
 */
function resolveAssignment($writtenId, $classroomCode, int $base, string $tag)
{
    $class = resolveOwnedClass($classroomCode, $base, $tag);
    if (is_int($class)) {
        return $class;
    }
    if (!is_int($writtenId)) {
        error_log("[$tag] Invalid input: `writtenId`.");
        return -($base + 1);
    }
    $written = findOwnedWritten($writtenId);
    if ($written === "missing") {
        error_log("[$tag] Written production #$writtenId does not exist.");
        return -($base + 4);
    }
    if ($written === "forbidden") {
        error_log("[$tag] You are not the owner of written production #$writtenId.");
        return -($base + 5);
    }
    $assignment = findAssignment($written["id"], $class["id"]);
    if ($assignment === false) {
        error_log("[$tag] Written production #$writtenId is not assigned to class room \"$classroomCode\".");
        return -($base + 6);
    }
    return ["class" => $class, "written" => $written, "assignment" => $assignment];
}

/**
 * Resolve the assignment of a written production to a class room, for a student.
 * The error codes are `-($base + n)`, with:
 * * n = 1: Invalid input.
 * * n = 2: There is no class room with this code.
 * * n = 3: This written production does not exist or is not assigned to this class room.
 *
 * @return array|int `["class" => array, "written" => array, "assignment" => array]`, or an error code.
 */
function resolvePublicAssignment($writtenId, $classroomCode, int $base, string $tag)
{
    if (!is_int($writtenId) || !isNonEmptyString($classroomCode)) {
        error_log("[$tag] Invalid input.");
        return -($base + 1);
    }
    $class = findClassByCode($classroomCode);
    if ($class === false) {
        error_log("[$tag] Class room \"$classroomCode\" does not exist.");
        return -($base + 2);
    }
    $written = findWritten($writtenId);
    $assignment = $written === false ? false : findAssignment($writtenId, $class["id"]);
    if ($assignment === false) {
        error_log("[$tag] Written production #$writtenId is not assigned to class room \"$classroomCode\".");
        return -($base + 3);
    }
    return ["class" => $class, "written" => $written, "assignment" => $assignment];
}

/**
 * The public infos of an upload, as sent to the student.
 */
function getPublicUpload(array $upload): array
{
    return [
        "slot" => $upload["slot"],
        "original" => $upload["original"],
        "mime" => $upload["mime"],
        "size" => $upload["size"],
        "late" => $upload["late"],
        "time" => $upload["time"],
    ];
}

/**
 * Format the expected files and the public infos of a written production.
 */
function getWrittenInfos(array $written): array
{
    return [
        "id" => $written["id"],
        "name" => $written["name"],
        "description" => $written["description"],
        "duration" => $written["duration"],
        "expiration" => $written["expiration"],
        "files" => $written["files"],
    ];
}

/**
 * Is the current user the owner of this class room?
 */
function isClassOwner(array $class): bool
{
    $user = $_SESSION["USER"] ?? null;
    return $user !== null && $class["user"] === $user["id"];
}

/**
 * Absolute path where the content of an upload is stored.
 */
function getUploadPath(int $id, string $ext, bool $partial = false): string
{
    $digits = (string) $id;
    $length = max(6, strlen($digits) + strlen($digits) % 2);
    $groups = str_split(str_pad($digits, $length, "0", STR_PAD_LEFT), 2);
    $path = WRITTEN_ROOT . "/" . implode("/", $groups);
    return $partial ? "$path.part" : "$path.$ext";
}

/**
 * Delete the uploads matching a SQL condition (rows and content).
 *
 * @param string $where SQL condition on the columns of `written_upload` (aliased `u`)
 * and `written_assignment` (aliased `a`).
 * @return int Number of deleted uploads.
 */
function deleteUploads(string $where, ...$params): int
{
    global $DB;

    $stmt = $DB->query(
        "SELECT `u`.`id`, `u`.`ext` FROM `{$DB->table("written_upload")}` AS `u`
         JOIN `{$DB->table("written_assignment")}` AS `a` ON `a`.`id` = `u`.`assignment`
         WHERE $where",
        ...$params
    );
    $rows = $stmt === false ? [] : $stmt->fetchAll();
    foreach ($rows as $row) {
        $id = (int) $row["id"];
        $DB->query("DELETE FROM `{$DB->table("written_upload")}` WHERE `id` = ?", $id);
        deleteUploadContent(getUploadPath($id, $row["ext"], true));
        deleteUploadContent(getUploadPath($id, $row["ext"]));
    }
    return count($rows);
}

/**
 * Delete the content of an upload, and the folders that become empty.
 */
function deleteUploadContent(string $path): void
{
    if (!is_file($path)) {
        return;
    }
    if (!@unlink($path)) {
        error_log("[written] Unable to delete \"$path\".");
        return;
    }
    $root = realpath(WRITTEN_ROOT);
    $dir = realpath(dirname($path));
    // `rmdir()` fails on non empty folders.
    while ($root !== false && $dir !== false && $dir !== $root && str_starts_with($dir, $root) && @rmdir($dir)) {
        $dir = dirname($dir);
    }
}

/**
 * Delete the expired uploads, and the incomplete ones that have been abandoned.
 * There is no CRON: this function is called by the entrypoints that add files
 * (so the storage cannot grow without cleaning it) and by the teacher's pages.
 */
function collectWrittenGarbage(): void
{
    $now = time();
    try {
        $count = deleteUploads(
            "(`a`.`expires_at` IS NOT NULL AND `a`.`expires_at` <= ?) OR (`u`.`complete` = 0 AND `u`.`time` < ?)",
            $now,
            $now - WRITTEN_PENDING_TIMEOUT
        );
        if ($count > 0) {
            error_log("[written] $count expired or abandoned upload(s) deleted.");
        }
    } catch (Exception $exception) {
        error_log("[written] Garbage collection failed: " . $exception->getMessage());
    }
}

/**
 * Short and public identifier of a computer. The computer ID is a secret
 * (it identifies the student), so it must never be sent to the teacher.
 */
function getComputerHash(string $computer): string
{
    return substr(hash("sha256", $computer), 0, 6);
}

/**
 * Name of an uploaded file when downloaded by the teacher: `{nickname}.{name}.{hash}.{ext}`.
 */
function getUploadDownloadName(string $nickname, string $slot, string $computer, string $ext): string
{
    $nickname = trim(preg_replace('#[\x00-\x1f\x7f/\\\\:*?"<>|]+#', "_", $nickname));
    if ($nickname === "" || str_starts_with($nickname, ".")) {
        $nickname = "_$nickname";
    }
    return "$nickname.$slot." . getComputerHash($computer) . ".$ext";
}

/**
 * @return string The extension of a file, deduced from its mime type,
 * or from its original name if the mime type is unknown.
 */
function getUploadExtension(string $mime, string $originalName): string
{
    return WRITTEN_MIME_EXTENSIONS[$mime] ?? getFileExtension($originalName);
}

/**
 * Normalize a mime type given by the browser.
 */
function normalizeMime($mime): string
{
    $mime = is_string($mime) ? strtolower(trim($mime)) : "";
    return preg_match('#^[a-z0-9!\#$&^_.+-]+/[a-z0-9!\#$&^_.+-]+$#', $mime) ? $mime : "application/octet-stream";
}

/**
 * The browsers do not always know the mime type of a file (Markdown for instance).
 * In this case, we try to deduce it from the extension of the file name.
 *
 * @return string The mime type to use for this file.
 */
function guessMime(string $declaredMime, string $name, array $expectedFile): string
{
    if ($declaredMime !== "application/octet-stream" && isMimeAccepted($declaredMime, $expectedFile)) {
        return $declaredMime;
    }
    $ext = getFileExtension($name);
    if ($ext === "jpeg") {
        $ext = "jpg";
    }
    $guessed = array_search($ext, WRITTEN_MIME_EXTENSIONS, true);
    return $guessed === false ? $declaredMime : $guessed;
}

/**
 * Is this mime type accepted by an expected file?
 * An empty list of mime types accepts everything.
 */
function isMimeAccepted(string $mime, array $expectedFile): bool
{
    $accepted = $expectedFile["mimeTypes"];
    return count($accepted) === 0 || in_array($mime, $accepted, true);
}

/**
 * The mime type of a file, as detected by `finfo`. If the detection gives a generic type
 * (a ZIP for an Office document, for instance), the type given by the browser is used.
 */
function detectMime(string $path, string $declaredMime): string
{
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $detected = $finfo->file($path);
    if (!is_string($detected) || $detected === "" || in_array($detected, WRITTEN_GENERIC_MIMES, true)) {
        return $declaredMime;
    }
    return normalizeMime($detected);
}

/**
 * @return array|false The expected file of a written production called `$slot`.
 */
function findExpectedFile(array $written, string $slot)
{
    foreach ($written["files"] as $file) {
        if ($file["name"] === $slot) {
            return $file;
        }
    }
    return false;
}

/**
 * List the complete uploads of an assignment.
 *
 * @param string|null $computer If not `null`, only the uploads of this computer.
 */
function listUploads(int $assignmentId, ?string $computer = null): array
{
    global $DB;

    $sql = "SELECT `id`, `computer`, `nickname`, `slot`, `original`, `mime`, `ext`, `size`, `late`, `time`
            FROM `{$DB->table("written_upload")}` WHERE `assignment` = ? AND `complete` = 1";
    $params = [$assignmentId];
    if ($computer !== null) {
        $sql .= " AND `computer` = ?";
        $params[] = $computer;
    }
    $stmt = $DB->query("$sql ORDER BY `nickname`, `slot`", ...$params);
    $rows = $stmt === false ? [] : $stmt->fetchAll();
    return array_map(fn($row) => [
        "id" => (int) $row["id"],
        "computer" => $row["computer"],
        "nickname" => $row["nickname"],
        "slot" => $row["slot"],
        "original" => $row["original"],
        "mime" => $row["mime"],
        "ext" => $row["ext"],
        "size" => (int) $row["size"],
        "late" => (int) $row["late"] === 1,
        "time" => (int) $row["time"],
    ], $rows);
}

/**
 * Send a ZIP archive of files to the browser (without compression)
 * and stop the script. The `zip` PHP extension is not needed.
 *
 * @param string $zipName Name of the archive for the browser.
 * @param array $entries `Array<{ name: string, path: string }>`
 */
function sendZip(string $zipName, array $entries): void
{
    $prepared = [];
    $offset = 0;
    [$time, $date] = getDosTime(time());
    foreach ($entries as $entry) {
        $size = @filesize($entry["path"]);
        if ($size === false) {
            continue;
        }
        $crc = (int) hexdec(hash_file("crc32b", $entry["path"]));
        // Bit 11: the name is encoded in UTF-8.
        $header = pack("VvvvvvVVVvv", 0x04034b50, 20, 0x0800, 0, $time, $date, $crc, $size, $size, strlen($entry["name"]), 0)
            . $entry["name"];
        $prepared[] = ["entry" => $entry, "header" => $header, "crc" => $crc, "size" => $size, "offset" => $offset];
        $offset += strlen($header) + $size;
    }
    $directory = "";
    foreach ($prepared as $item) {
        $directory .= pack(
            "VvvvvvvVVVvvvvvVV",
            0x02014b50,
            20,
            20,
            0x0800,
            0,
            $time,
            $date,
            $item["crc"],
            $item["size"],
            $item["size"],
            strlen($item["entry"]["name"]),
            0,
            0,
            0,
            0,
            0,
            $item["offset"]
        ) . $item["entry"]["name"];
    }
    $end = pack("VvvvvVVv", 0x06054b50, 0, 0, count($prepared), count($prepared), strlen($directory), $offset, 0);

    header("Content-Type: application/zip");
    header("Content-Disposition: " . getContentDisposition("attachment", $zipName));
    header("Content-Length: " . ($offset + strlen($directory) + strlen($end)));
    header("X-Content-Type-Options: nosniff");
    header("Cache-Control: private, no-cache");
    foreach ($prepared as $item) {
        echo $item["header"];
        readfile($item["entry"]["path"]);
    }
    echo $directory;
    echo $end;
    exit;
}

/**
 * @return int[] `[time, date]` in MS-DOS format, as used in ZIP files.
 */
function getDosTime(int $timestamp): array
{
    $d = getdate($timestamp);
    return [
        ($d["hours"] << 11) | ($d["minutes"] << 5) | intdiv($d["seconds"], 2),
        (max(0, $d["year"] - 1980) << 9) | ($d["mon"] << 5) | $d["mday"],
    ];
}

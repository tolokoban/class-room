<?php

require_once __DIR__ . "/db.php";

/**
 * Files uploaded by the teachers (table `files`).
 *
 * Their content is stored in `www/files/` (protected by a `.htaccess`).
 * To avoid having too many entries in one folder, the path is built from
 * the ID of the file, split in groups of two digits: no folder holds more
 * than 100 files and 100 subfolders.
 * For instance, the file `my-slides.odp` with ID 47211 is stored
 * in `files/04/72/11.odp`.
 */
const FILES_ROOT = __DIR__ . "/../files";

/**
 * The files are uploaded by chunks (table `file_upload`):
 * `file/upload-init`, `file/upload-chunk` and `file/upload-complete`.
 * While being uploaded, the content is stored here, with the extension `.part`.
 */
const FILE_UPLOADS_ROOT = FILES_ROOT . "/uploads";

/** Maximum size (in bytes) of a file. */
const FILE_MAX_SIZE = 100 * 1024 * 1024;

/** Maximum size (in bytes) of a decoded chunk. */
const FILE_MAX_CHUNK_SIZE = 1024 * 1024;

/** Incomplete uploads are deleted after this number of seconds without any new chunk. */
const FILE_UPLOAD_TIMEOUT = 3600;

/**
 * The Markdown notes of a class room are stored as a file with this name
 * (see `file/notes-get` and `file/notes-set`). The teacher cannot upload
 * a file with this name, and it is not listed by `file/list`.
 */
const NOTES_FILE_NAME = "notes.md";
const NOTES_MIME = "text/markdown";

/**
 * Mime types sent with `Content-Disposition: inline` without any risk:
 * * the browser can display them in a tab (images, PDF, plain text, audio, video),
 * * or it cannot display them at all, and lets the application mapped to the type
 *   in its settings open them (Word, LibreOffice and PowerPoint documents).
 * Everything else (HTML, SVG, ...) is downloaded: displaying it inline
 * would run its scripts in the origin of the application.
 */
const INLINE_MIME_PATTERN = '#^(image/(png|jpeg|gif|webp|avif|bmp)|application/pdf|text/plain|audio/.+|video/.+'
    . '|application/(msword|vnd\.ms-excel|vnd\.ms-powerpoint)'
    . '|application/vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|spreadsheetml\.sheet|presentationml\.presentation)'
    . '|application/vnd\.oasis\.opendocument\.(text|spreadsheet|presentation))$#';

/**
 * Is this name reserved (case insensitive, like the database collation)?
 */
function isReservedFileName(string $name): bool
{
    return mb_strtolower($name) === NOTES_FILE_NAME;
}

/**
 * @return array|false `["id" => int, "name" => string]` of the notes file of a class room,
 * or `false` if there is none yet.
 */
function findNotesFile(int $classroom)
{
    global $DB;

    $stmt = $DB->query(
        "SELECT `id`, `name` FROM `{$DB->table("files")}` WHERE `classroom` = ? AND `name` = ?",
        $classroom,
        NOTES_FILE_NAME
    );
    $row = $stmt === false ? false : $stmt->fetch();
    return $row === false ? false : ["id" => (int) $row["id"], "name" => $row["name"]];
}

/**
 * Absolute path where the content of a file is stored.
 *
 * @param int $id Field `id` of table `files`.
 * @param string $name Field `name` of table `files` (only the extension is used).
 */
function getFilePath(int $id, string $name): string
{
    return FILES_ROOT . "/" . getIdFolders($id) . "." . getFileExtension($name);
}

/**
 * Absolute path where the content of a file being uploaded is stored.
 *
 * @param int $id Field `id` of table `file_upload`.
 */
function getFileUploadPath(int $id): string
{
    return FILE_UPLOADS_ROOT . "/" . getIdFolders($id) . ".part";
}

/**
 * An ID split in groups of two digits (at least 3 groups): "04/72/11" for 47211.
 */
function getIdFolders(int $id): string
{
    $digits = (string) $id;
    $length = max(6, strlen($digits) + strlen($digits) % 2);
    return implode("/", str_split(str_pad($digits, $length, "0", STR_PAD_LEFT), 2));
}

/**
 * Lowercase extension of a file name, with only `[a-z0-9]` characters.
 * Defaults to "bin" if there is no extension.
 */
function getFileExtension(string $name): string
{
    $extension = preg_replace('/[^a-z0-9]+/', "", strtolower(pathinfo($name, PATHINFO_EXTENSION)));
    return $extension === "" ? "bin" : substr($extension, 0, 16);
}

/**
 * Remove any folder from a file name and check it is valid.
 *
 * @return string|false The cleaned name, or `false` if it is invalid.
 */
function sanitizeFileName($name)
{
    if (!is_string($name)) {
        return false;
    }
    $parts = preg_split('#[/\\\\]#', $name);
    $name = trim(end($parts));
    if (
        $name === "" || $name === "." || $name === ".."
        || mb_strlen($name) > 255
        || preg_match('/[\x00-\x1f\x7f]/', $name)
    ) {
        return false;
    }
    return $name;
}

/**
 * Normalize a mime type given by the browser.
 * An invalid or missing type becomes "application/octet-stream".
 */
function normalizeMime($mime): string
{
    $mime = is_string($mime) ? strtolower(trim($mime)) : "";
    return preg_match('#^[a-z0-9!\#$&^_.+-]+/[a-z0-9!\#$&^_.+-]+$#', $mime) ? $mime : "application/octet-stream";
}

/**
 * @return array|false `["id", "classroom", "name", "size", "mime", "user"]`
 * where `user` is the owner of the class room, or `false` if there is no file with this ID.
 */
function findFile(int $id)
{
    global $DB;

    $stmt = $DB->query(
        "SELECT `f`.`id`, `f`.`classroom`, `f`.`name`, `f`.`size`, `f`.`mime`, `c`.`user`
         FROM `{$DB->table("files")}` AS `f`
         JOIN `{$DB->table("class")}` AS `c` ON `c`.`id` = `f`.`classroom`
         WHERE `f`.`id` = ?",
        $id
    );
    $row = $stmt === false ? false : $stmt->fetch();
    if ($row === false) {
        return false;
    }

    return [
        "id" => (int) $row["id"],
        "classroom" => (int) $row["classroom"],
        "name" => $row["name"],
        "size" => (int) $row["size"],
        "mime" => $row["mime"],
        "user" => (int) $row["user"],
    ];
}

/**
 * Is there a file with this name in this class room?
 *
 * @param int|null $exceptId ID of a file to ignore (the one being replaced).
 */
function isFileNameUsed(int $classroom, string $name, ?int $exceptId = null): bool
{
    global $DB;

    $stmt = $DB->query(
        "SELECT `id` FROM `{$DB->table("files")}` WHERE `classroom` = ? AND `name` = ? AND `id` <> ?",
        $classroom,
        $name,
        $exceptId ?? 0
    );
    return $stmt !== false && $stmt->fetch() !== false;
}

/**
 * Write the content of a file, creating the missing folders.
 * The content is written in a temporary file first, so that an existing
 * file is never left half written.
 */
function writeFileContent(string $path, string $content): bool
{
    $dir = dirname($path);
    if (!is_dir($dir) && !@mkdir($dir, 0775, true) && !is_dir($dir)) {
        error_log("[file] Unable to create folder \"$dir\".");
        return false;
    }
    $tmp = "$path.tmp";
    if (@file_put_contents($tmp, $content) !== strlen($content)) {
        error_log("[file] Unable to write \"$tmp\".");
        @unlink($tmp);
        return false;
    }
    if (!@rename($tmp, $path)) {
        error_log("[file] Unable to rename \"$tmp\" into \"$path\".");
        @unlink($tmp);
        return false;
    }
    return true;
}

/**
 * Move a content (a complete upload) to its final path, creating the missing folders.
 * An existing file at `$to` is replaced.
 */
function moveFileContent(string $from, string $to): bool
{
    $dir = dirname($to);
    if (!is_dir($dir) && !@mkdir($dir, 0775, true) && !is_dir($dir)) {
        error_log("[file] Unable to create folder \"$dir\".");
        return false;
    }
    if (!@rename($from, $to)) {
        error_log("[file] Unable to rename \"$from\" into \"$to\".");
        return false;
    }
    return true;
}

/**
 * An upload in progress, if it belongs to a class room of the current user.
 *
 * @return array|false `["id", "classroom", "file", "name", "mime", "size", "received", "time"]`
 * (`file` is `null` for a new file), or `false` if there is no such upload for the current user.
 */
function findOwnedFileUpload(int $id)
{
    global $DB;

    $stmt = $DB->query(
        "SELECT `u`.*, `c`.`user` FROM `{$DB->table("file_upload")}` AS `u`
         JOIN `{$DB->table("class")}` AS `c` ON `c`.`id` = `u`.`classroom`
         WHERE `u`.`id` = ?",
        $id
    );
    $row = $stmt === false ? false : $stmt->fetch();
    $user = $_SESSION["USER"] ?? null;
    if ($row === false || $user === null || (int) $row["user"] !== $user["id"]) {
        return false;
    }

    return [
        "id" => (int) $row["id"],
        "classroom" => (int) $row["classroom"],
        "file" => $row["file"] === null ? null : (int) $row["file"],
        "name" => $row["name"],
        "mime" => $row["mime"],
        "size" => (int) $row["size"],
        "received" => (int) $row["received"],
        "time" => (int) $row["time"],
    ];
}

/**
 * Delete the uploads in progress that have not received any chunk
 * for `FILE_UPLOAD_TIMEOUT` seconds (rows and content).
 * There is no CRON: this function is called by `file/upload-init`.
 */
function collectFileUploadGarbage(): void
{
    global $DB;

    try {
        $stmt = $DB->query(
            "SELECT `id` FROM `{$DB->table("file_upload")}` WHERE `time` < ?",
            time() - FILE_UPLOAD_TIMEOUT
        );
        $rows = $stmt === false ? [] : $stmt->fetchAll();
        foreach ($rows as $row) {
            $id = (int) $row["id"];
            $DB->query("DELETE FROM `{$DB->table("file_upload")}` WHERE `id` = ?", $id);
            deleteFileContent(getFileUploadPath($id));
        }
        if (count($rows) > 0) {
            error_log("[file] " . count($rows) . " abandoned upload(s) deleted.");
        }
    } catch (Exception $exception) {
        error_log("[file] Garbage collection failed: " . $exception->getMessage());
    }
}

/**
 * Delete the content of a file, and the folders that become empty.
 */
function deleteFileContent(string $path): void
{
    if (is_file($path) && !@unlink($path)) {
        error_log("[file] Unable to delete \"$path\".");
        return;
    }
    $root = realpath(FILES_ROOT);
    $dir = realpath(dirname($path));
    // `rmdir()` fails on non empty folders.
    while ($root !== false && $dir !== false && $dir !== $root && str_starts_with($dir, $root) && @rmdir($dir)) {
        $dir = dirname($dir);
    }
}


/**
 * Value of the `Content-Disposition` header for a file called `$name`:
 * an ASCII fallback for old browsers, and the exact UTF-8 name (RFC 6266).
 */
function getContentDisposition(string $disposition, string $name): string
{
    $asciiName = preg_replace('/[^\x20-\x7e]|["\\\\]/u', "_", $name);
    return "$disposition; filename=\"$asciiName\"; filename*=UTF-8''" . rawurlencode($name);
}

/**
 * Send the content of a file to the browser and stop the script.
 * It is displayed in a tab only if its mime type is safe (see `INLINE_MIME_PATTERN`),
 * otherwise it is downloaded.
 */
function sendFileContent(string $path, string $name, string $mime): void
{
    $disposition = preg_match(INLINE_MIME_PATTERN, $mime) ? "inline" : "attachment";
    header("Content-Type: $mime");
    header("Content-Disposition: " . getContentDisposition($disposition, $name));
    header("Content-Length: " . filesize($path));
    header("X-Content-Type-Options: nosniff");
    header("Content-Security-Policy: sandbox");
    header("Cache-Control: private, no-cache");
    readfile($path);
    exit;
}

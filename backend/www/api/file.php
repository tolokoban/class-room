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
 * The Markdown notes of a class room are stored as a file with this name
 * (see `file/notes-get` and `file/notes-set`). The teacher cannot upload
 * a file with this name, and it is not listed by `file/list`.
 */
const NOTES_FILE_NAME = "notes.md";
const NOTES_MIME = "text/markdown";

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
    $digits = (string) $id;
    // At least 3 groups of 2 digits.
    $length = max(6, strlen($digits) + strlen($digits) % 2);
    $groups = str_split(str_pad($digits, $length, "0", STR_PAD_LEFT), 2);
    return FILES_ROOT . "/" . implode("/", $groups) . "." . getFileExtension($name);
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
 * Decode a data URL (`data:<mime>;base64,<content>`), as produced
 * by `FileReader.readAsDataURL()` in the browser.
 *
 * @return array|false `["mime" => string, "content" => string]`,
 * or `false` if this is not a valid base64 data URL.
 */
function parseDataUrl($file)
{
    if (!is_string($file) || !preg_match('/^data:([^;,]*)((?:;[^;,]*)*),/', $file, $matches)) {
        return false;
    }
    $params = array_map("trim", explode(";", strtolower($matches[2])));
    if (!in_array("base64", $params, true)) {
        return false;
    }
    $content = base64_decode(substr($file, strlen($matches[0])), true);
    if ($content === false) {
        return false;
    }
    $mime = strtolower(trim($matches[1]));
    if (!preg_match('#^[a-z0-9!\#$&^_.+-]+/[a-z0-9!\#$&^_.+-]+$#', $mime)) {
        $mime = "application/octet-stream";
    }
    return ["mime" => $mime, "content" => $content];
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

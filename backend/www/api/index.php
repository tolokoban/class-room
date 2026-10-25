<?php
require_once __DIR__ . "/db.php";

// The MCP server authenticates with a bearer token, not with a session cookie.
if (($_GET["path"] ?? "") === "mcp") {
    require __DIR__ . "/mcp.php";
    exit;
}

@session_start();

header("Content-Type: application/json");

/**
 * Send an HTTP error code to the client (with an optional JSON body)
 * and stop the script.
 */
function fail(int $code, ?string $message = null): void
{
    error_log("HTTP Error #$code: $message");
    http_response_code($code);
    if ($message !== null) {
        echo json_encode(["error" => $message]);
    }
    exit;
}

// See `.htaccess`: everything after `/api/` is forwarded here as `path`
// (without a leading slash, e.g. "entrypoint/login").
$path = $_GET["path"] ?? "";

if ($path === "") {
    fail(404);
}

// Try to include the entrypoint matching this path. It is expected to
// define a function called `entrypoint()`.
@include __DIR__ . "/entrypoint/$path/index.php";

if (!function_exists("entrypoint")) {
    error_log("Invalid service: " . __DIR__ . "/$path/index.php");
    fail(404);
}

if (!isset($ROLE) || !is_string($ROLE) && !is_array($ROLE)) {
    // Every entrypoints must define $ROLE
    fail(401);
}

// `$ROLE` can be a single role (string) or a list of roles (array).
// When it is a list, the roles act as an OR: the current user only
// needs to own at least one of them.
$requiredRoles = is_array($ROLE) ? $ROLE : ($ROLE === "" ? [] : [$ROLE]);

if (count($requiredRoles) > 0) {
    $user = $_SESSION["USER"] ?? null;
    if ($user === null || count(array_intersect($requiredRoles, $user["roles"])) === 0) {
        fail(403);
    }
}

$raw = file_get_contents("php://input");

if ($raw === "" || $raw === false) {
    $input = null;
} else {
    $input = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        fail(400);
    }
}

$output = null;
try {
    $output = entrypoint($input);
} catch (Exception $exception) {
    fail(500, $exception->getMessage());
}

echo json_encode($output);

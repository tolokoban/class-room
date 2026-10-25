<?php
require_once __DIR__ . "/../../../db.php";
require_once __DIR__ . "/../../../session.php";

$ROLE = "";

/**
 * Look in the database to see if a user with the given `login`
 * and `password` exists. The password is not stored in plain text
 * in the database, but we can test it with `password_verify()`.
 *
 * If the user is recognized, we store the following object in `$_SESSION["USER"]`:
 * ```ts
 * {
 *   id: number // field `id` of table `user`
 *   name: string // field `name` of table `user`
 *   login: string // field `login` of table `user`
 *   roles: string[] // names of all the roles linked to this user with table `user_role`
 * }
 * ```
 *
 * @param mixed $input
 * ```ts
 * {
 *   login: string // Field `login` of table `user` (not empty).
 *   password: string // Password in plain text (not empty).
 * }
 * ```
 * @return mixed If a user with this `login` and `password` exists,
 * then return the same object as the one stored in `$_SESSION["USER"]`
 * (see above), otherwise:
 * * -10101: Invalid input.
 * * -10102: Unknown login or wrong password.
 */
function entrypoint($input)
{
    global $DB;

    $login = $input["login"] ?? null;
    $password = $input["password"] ?? null;

    if (!is_string($login) || !is_string($password) || $login === "" || $password === "") {
        error_log("[user/login] Invalid input.");
        return -10101;
    }

    $stmt = $DB->query(
        "SELECT `id`, `password` FROM `{$DB->table("user")}` WHERE `login` = ?",
        $login
    );
    $user = $stmt === false ? false : $stmt->fetch();

    if ($user === false) {
        error_log("[user/login] There is no user with login \"$login\"!");
        return -10102;
    }

    if (!password_verify($password, $user["password"])) {
        error_log("[user/login] Invalid password for user \"$login\"!");
        return -10102;
    }

    $sessionUser = buildSessionUser((int) $user["id"]);
    if ($sessionUser === false) {
        return -10102;
    }

    // Prevent session fixation.
    session_regenerate_id(true);
    $_SESSION["USER"] = $sessionUser;

    return $sessionUser;
}

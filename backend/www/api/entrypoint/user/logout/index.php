<?php
require_once __DIR__ . "/../../../db.php";

$ROLE = "";

/**
 * Unset the `$_SESSION["USER"]` variable to logout the current user.
 *
 * @param null $input Ignored.
 * @return bool Always `true`.
 */
function entrypoint($input)
{
    unset($_SESSION["USER"]);
    return true;
}

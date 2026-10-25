<?php

require_once __DIR__ . "/db.php";

/**
 * Build the object describing a user, as it is stored in `$_SESSION["USER"]`.
 *
 * ```ts
 * {
 *   id: number // field `id` of table `user`
 *   name: string // field `name` of table `user`
 *   login: string // field `login` of table `user`
 *   roles: string[] // all fields `name` of table `role` linked to this user with table `user_role`
 * }
 * ```
 *
 * @return array|false `false` if there is no user with this ID.
 */
function buildSessionUser(int $userId)
{
    global $DB;

    $stmt = $DB->query(
        "SELECT `id`, `name`, `login` FROM `{$DB->table("user")}` WHERE `id` = ?",
        $userId
    );
    $user = $stmt === false ? false : $stmt->fetch();
    if ($user === false) {
        return false;
    }

    $stmt = $DB->query(
        "SELECT `r`.`name` FROM `{$DB->table("user_role")}` AS `ur`
         JOIN `{$DB->table("role")}` AS `r` ON `r`.`id` = `ur`.`role`
         WHERE `ur`.`user` = ?",
        $user["id"]
    );
    $roles = $stmt === false ? [] : array_column($stmt->fetchAll(), "name");

    return [
        "id" => (int) $user["id"],
        "name" => $user["name"],
        "login" => $user["login"],
        "roles" => $roles,
    ];
}

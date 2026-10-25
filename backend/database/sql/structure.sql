-- Every table name is prefixed with `classroom_` (see `$DB_PRFX` in backend/www/api/env.php).

CREATE TABLE `classroom_role` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(32) NOT NULL,
  UNIQUE (`name`)
);

CREATE TABLE `classroom_user` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `login` VARCHAR(255) NOT NULL,
  -- Hashed with PHP's `password_hash()`.
  `password` VARCHAR(255) NOT NULL,
  UNIQUE (`login`)
);

CREATE TABLE `classroom_user_role` (
  `user` integer NOT NULL,
  `role` integer NOT NULL,
  PRIMARY KEY (`user`, `role`)
);
ALTER TABLE `classroom_user_role` ADD FOREIGN KEY (`user`) REFERENCES `classroom_user` (`id`) ON DELETE CASCADE;
ALTER TABLE `classroom_user_role` ADD FOREIGN KEY (`role`) REFERENCES `classroom_role` (`id`) ON DELETE CASCADE;

CREATE TABLE `classroom_class` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  -- Author (with role "teacher").
  `user` integer NOT NULL,
  -- The code to give to the students to access the class.
  `code` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  -- Markdown description of this class room.
  `description` TEXT NOT NULL,
  UNIQUE (`code`)
);
ALTER TABLE `classroom_class` ADD FOREIGN KEY (`user`) REFERENCES `classroom_user` (`id`) ON DELETE CASCADE;

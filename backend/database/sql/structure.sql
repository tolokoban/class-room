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
  `code` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  -- Markdown description of this class room.
  `description` TEXT NOT NULL,
  -- The code of the activity to display to the student, or NULL
  `activity` VARCHAR(255) DEFAULT NULL,
  UNIQUE (`code`)
);
ALTER TABLE `classroom_class` ADD FOREIGN KEY (`user`) REFERENCES `classroom_user` (`id`) ON DELETE CASCADE;

CREATE TABLE `classroom_activity` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `code` VARCHAR(255) NOT NULL,
  `classroom` integer NOT NULL,
  -- Unique identifier for the student's computer
  `computer` VARCHAR(255) NOT NULL,
  -- Student's nickname
  `nickname` VARCHAR(255) NOT NULL,
  -- Choices made in the quiz
  `result` TEXT,
  -- A nickname can only be used once per activity in a class room.
  UNIQUE (`classroom`, `code`, `nickname`)
);
ALTER TABLE `classroom_activity` ADD FOREIGN KEY (`classroom`) REFERENCES `classroom_class` (`id`) ON DELETE CASCADE;

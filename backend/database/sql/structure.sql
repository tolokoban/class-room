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
  -- Maximum number of students that can join this class room at the same time (see table `seat`).
  `max_students` integer NOT NULL DEFAULT 24,
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

-- The last class room entered by each student.
CREATE TABLE `classroom_room` (
  -- Unique identifier for the student's computer.
  `computer` VARCHAR(255) NOT NULL,
  -- Student's nickname.
  `nickname` VARCHAR(255) NOT NULL,
  `classroom` integer NOT NULL,
  -- Last time the student entered this class room.
  `time` DATETIME NOT NULL,
  PRIMARY KEY (`computer`)
);
ALTER TABLE `classroom_room` ADD FOREIGN KEY (`classroom`) REFERENCES `classroom_class` (`id`) ON DELETE CASCADE;

-- Files uploaded by the teacher in a class room ("Ressources pédagogiques").
-- The content is stored in `www/files/` (see `backend/www/api/file.php`).
CREATE TABLE `classroom_files` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `classroom` integer NOT NULL,
  -- Name of the file, with its extension but without any folder.
  `name` VARCHAR(255) NOT NULL,
  -- Size of the file in bytes.
  `size` integer NOT NULL,
  `mime` VARCHAR(255) NOT NULL,
  -- A file name can only be used once per class room.
  UNIQUE (`classroom`, `name`)
);
ALTER TABLE `classroom_files` ADD FOREIGN KEY (`classroom`) REFERENCES `classroom_class` (`id`) ON DELETE CASCADE;

-- The students that have joined a class room. A seat is reserved for a computer
-- until the teacher frees it (see `room/kick`). The number of seats of a class room
-- is limited by `class.max_students`.
CREATE TABLE `classroom_seat` (
  `classroom` integer NOT NULL,
  -- Unique identifier for the student's computer.
  `computer` VARCHAR(255) NOT NULL,
  -- Student's nickname: only one seat can use it in a class room.
  `nickname` VARCHAR(255) NOT NULL,
  -- Last time the student was seen in this class room.
  `time` DATETIME NOT NULL,
  PRIMARY KEY (`classroom`, `computer`),
  UNIQUE (`classroom`, `nickname`)
);
ALTER TABLE `classroom_seat` ADD FOREIGN KEY (`classroom`) REFERENCES `classroom_class` (`id`) ON DELETE CASCADE;

-- Generic activities of type "Production écrite" ("written production"), defined by a teacher.
CREATE TABLE `classroom_written` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  -- Author (with role "teacher").
  `user` integer NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  -- Markdown description of what is expected from the students.
  `description` TEXT NOT NULL,
  -- Duration of the exercise, in minutes.
  `duration` integer NOT NULL,
  -- The uploaded files are deleted this number of hours after the end of the exercise.
  `expiration` integer NOT NULL DEFAULT 24,
  -- JSON: Array<{ name: string, mimeTypes: string[], maxSize: number }>
  -- An empty `mimeTypes` means that any type is accepted.
  `files` TEXT NOT NULL,
  UNIQUE (`user`, `name`)
);
ALTER TABLE `classroom_written` ADD FOREIGN KEY (`user`) REFERENCES `classroom_user` (`id`) ON DELETE CASCADE;

-- A written production assigned to a class room, with the state of its timer.
-- Times are UNIX timestamps in seconds.
-- * Not started: `end_time` and `remaining` are NULL.
-- * Running: `end_time` is set.
-- * Paused: `remaining` (seconds) is set.
CREATE TABLE `classroom_written_assignment` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `written` integer NOT NULL,
  `classroom` integer NOT NULL,
  `end_time` BIGINT DEFAULT NULL,
  `remaining` integer DEFAULT NULL,
  -- Hours added by the teacher to the expiration of the files.
  `extension` integer NOT NULL DEFAULT 0,
  -- When the uploaded files must be deleted (`end_time` + `expiration` + `extension`), NULL if not started.
  -- It does not change while the timer is paused.
  `expires_at` BIGINT DEFAULT NULL,
  -- Position of the written production in the list of the class room (ascending order).
  `position` integer NOT NULL DEFAULT 0,
  UNIQUE (`written`, `classroom`)
);
ALTER TABLE `classroom_written_assignment` ADD FOREIGN KEY (`written`) REFERENCES `classroom_written` (`id`) ON DELETE CASCADE;
ALTER TABLE `classroom_written_assignment` ADD FOREIGN KEY (`classroom`) REFERENCES `classroom_class` (`id`) ON DELETE CASCADE;

-- Files attached by the teacher to a written production, that the students can download
-- while it is the current activity of their class room (see `written/attachment-get`).
-- They are shared by all the class rooms the written production is assigned to, and never expire.
-- The content is stored in `www/files/written/attachments/` (see `backend/www/api/written.php`).
-- A Markdown description can link to an attachment with `[text](attachment:name.ext)`.
CREATE TABLE `classroom_written_attachment` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `written` integer NOT NULL,
  -- Name of the file, with its extension but without any folder.
  -- Uploading a file with the same name replaces the previous one.
  `name` VARCHAR(255) NOT NULL,
  `mime` VARCHAR(255) NOT NULL,
  -- Extension of the stored file, deduced from its mime type.
  `ext` VARCHAR(16) NOT NULL,
  -- Declared size of the file in bytes.
  `size` BIGINT NOT NULL,
  -- Number of bytes received so far.
  `received` BIGINT NOT NULL DEFAULT 0,
  -- 0 while the chunks are being sent, 1 once the file is complete.
  `complete` TINYINT NOT NULL DEFAULT 0,
  -- UNIX timestamp of the last change.
  `time` BIGINT NOT NULL,
  INDEX (`written`, `name`)
);
ALTER TABLE `classroom_written_attachment` ADD FOREIGN KEY (`written`) REFERENCES `classroom_written` (`id`) ON DELETE CASCADE;

-- Files uploaded by the students for a written production.
-- The content is stored in `www/files/written/` (see `backend/www/api/written.php`).
CREATE TABLE `classroom_written_upload` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `assignment` integer NOT NULL,
  -- Owner of the upload.
  `computer` VARCHAR(255) NOT NULL,
  -- Nickname of the student when the file was uploaded.
  `nickname` VARCHAR(255) NOT NULL,
  -- Field `name` of the expected file.
  `slot` VARCHAR(255) NOT NULL,
  -- Original name of the uploaded file.
  `original` VARCHAR(255) NOT NULL,
  `mime` VARCHAR(255) NOT NULL,
  -- Extension of the file, deduced from its mime type.
  `ext` VARCHAR(16) NOT NULL,
  -- Declared size of the file in bytes.
  `size` BIGINT NOT NULL,
  -- Number of bytes received so far.
  `received` BIGINT NOT NULL DEFAULT 0,
  -- 0 while the chunks are being sent, 1 once the file is complete.
  `complete` TINYINT NOT NULL DEFAULT 0,
  -- 1 if the file has been completed after the end of the timer.
  `late` TINYINT NOT NULL DEFAULT 0,
  -- UNIX timestamp of the last change.
  `time` BIGINT NOT NULL,
  INDEX (`assignment`, `computer`, `slot`)
);
ALTER TABLE `classroom_written_upload` ADD FOREIGN KEY (`assignment`) REFERENCES `classroom_written_assignment` (`id`) ON DELETE CASCADE;

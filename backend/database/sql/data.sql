INSERT INTO `classroom_role` (`id`, `name`) VALUES
(1, 'admin'),
(2, 'teacher'),
(3, 'student');

-- Default administrator. Login: "admin", password: "admin".
-- Change this password as soon as possible!
INSERT INTO `classroom_user` (`id`, `name`, `login`, `password`) VALUES
(1, 'Administrator', 'admin', '$2y$10$YjJo96uKFj1OUfkOXxapbepVabfnmEKALrBxL0R6MChICCNHzRzse');

INSERT INTO `classroom_user_role` (`user`, `role`) VALUES
(1, 1), (1, 2);

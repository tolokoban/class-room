INSERT INTO `classroom_role` (`id`, `name`) VALUES
(1, 'admin'),
(2, 'teacher'),
(3, 'student');

-- Default administrator. Login: "admin", password: "admin".
-- Change this password as soon as possible!
INSERT INTO `classroom_user` (`id`, `name`, `login`, `password`) VALUES
(1, 'Tolokoban', 'tolokoban', '$2y$12$jdsDkHkSETeKHrc9mcTbROA9pAnhtZBvmuVTKQaPAVE4nX43Qb0je');

INSERT INTO `classroom_user_role` (`user`, `role`) VALUES
(1, 1), (1, 2);

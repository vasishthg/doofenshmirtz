CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(405) DEFAULT NULL,
  `email` varchar(415) DEFAULT NULL,
  `username` varchar(415) DEFAULT NULL,
  `password` varchar(310) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `following` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

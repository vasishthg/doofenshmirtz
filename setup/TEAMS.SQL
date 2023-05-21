CREATE TABLE `teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teamname` varchar(415) DEFAULT NULL,
  `teamabbrv` varchar(45) DEFAULT NULL,
  `followers` int DEFAULT NULL,
  `imgurl` varchar(415) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
SELECT * FROM xino.teams;
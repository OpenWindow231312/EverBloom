-- ========================================
-- 🌸 EverBloom — Favourites Table Migration
-- Create user-specific favourites functionality
-- ========================================

CREATE TABLE IF NOT EXISTS `Favourites` (
  `favourite_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `flower_id` INT(11) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`favourite_id`),
  UNIQUE KEY `unique_user_flower` (`user_id`, `flower_id`),
  KEY `user_id` (`user_id`),
  KEY `flower_id` (`flower_id`),
  CONSTRAINT `Favourites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Favourites_ibfk_2` FOREIGN KEY (`flower_id`) REFERENCES `Flowers` (`flower_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

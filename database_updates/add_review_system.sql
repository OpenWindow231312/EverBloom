-- ========================================
-- 🌸 EverBloom — Review System Migration
-- ========================================
-- This script updates the Reviews table to support flower reviews
-- with star ratings, headings, comments, and image uploads
--
-- Author: EverBloom Development Team
-- Date: 2025-11-13
-- ========================================

-- Drop existing Reviews table (BACKUP DATA FIRST if you want to keep it!)
DROP TABLE IF EXISTS `Reviews`;

-- Create new Reviews table for flower reviews
CREATE TABLE `Reviews` (
  `review_id` int(11) NOT NULL AUTO_INCREMENT,
  `flower_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL DEFAULT 5,
  `heading` varchar(255) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `flower_id` (`flower_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Reviews_ibfk_1` FOREIGN KEY (`flower_id`) REFERENCES `Flowers` (`flower_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Add index for faster queries on flower reviews
CREATE INDEX `idx_flower_reviews` ON `Reviews` (`flower_id`, `createdAt` DESC);

-- Add index for user reviews (for account page)
CREATE INDEX `idx_user_reviews` ON `Reviews` (`user_id`, `createdAt` DESC);

-- Add check constraint for rating (1-5 stars)
-- Note: MySQL check constraints are supported in MySQL 8.0.16+
-- For older versions, this will be handled at application level
ALTER TABLE `Reviews` ADD CONSTRAINT `chk_rating_range` CHECK (`rating` >= 1 AND `rating` <= 5);

-- ========================================
-- Sample Data (Optional - for testing)
-- ========================================
-- To insert sample reviews, uncomment the following lines.
-- Note: Make sure users with user_id 2, 3, 4 and flowers with flower_id 1, 2 exist in your database.
-- If you get a duplicate entry error, the table already has data - either skip this or delete existing reviews first.

-- INSERT INTO `Reviews` (`flower_id`, `user_id`, `rating`, `heading`, `comment`, `image_url`, `createdAt`, `updatedAt`) VALUES
-- (1, 2, 5, 'Absolutely Beautiful!', 'These roses are stunning! Fresh, long-lasting, and the perfect shade of red. Highly recommend for any special occasion.', NULL, NOW(), NOW()),
-- (1, 4, 4, 'Great quality, minor issue', 'The roses were gorgeous and fresh. One stem was slightly shorter than expected, but overall very pleased with the purchase.', NULL, NOW(), NOW()),
-- (2, 3, 5, 'Perfect for my wedding!', 'Used these carnations for my wedding bouquet and they were absolutely perfect. Lasted all day and looked amazing in photos!', NULL, NOW(), NOW());

-- ========================================
-- Migration Complete
-- ========================================
-- The Reviews table now supports:
-- ✅ Flower-specific reviews (instead of order reviews)
-- ✅ Star ratings (1-5)
-- ✅ Review headings
-- ✅ Review comments
-- ✅ Image uploads for reviews
-- ✅ User profile association
-- ✅ Timestamps for sorting
-- ========================================

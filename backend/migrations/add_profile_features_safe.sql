-- ========================================
-- 🌸 EverBloom — Profile Features Migration (phpMyAdmin Safe Version)
-- Add profile photo, addresses, and payment methods
-- ========================================
-- INSTRUCTIONS:
-- 1. Copy ONE section at a time
-- 2. Paste into phpMyAdmin SQL tab
-- 3. Click "Go" or "Execute"
-- 4. If you get "Duplicate column" error, that's OK - skip to next section
-- ========================================

-- ========================================
-- SECTION 1: Add profilePhoto to Users table
-- (If you get error "Duplicate column name 'profilePhoto'", skip this - it already exists)
-- ========================================
ALTER TABLE `Users` 
ADD COLUMN `profilePhoto` VARCHAR(255) NULL DEFAULT NULL;

-- ========================================
-- SECTION 2: Add phone to Users table
-- (If you get error "Duplicate column name 'phone'", skip this - it already exists)
-- ========================================
ALTER TABLE `Users`
ADD COLUMN `phone` VARCHAR(255) NULL DEFAULT NULL;

-- ========================================
-- SECTION 3: Create Addresses table
-- (This should work even if run multiple times due to IF NOT EXISTS)
-- ========================================
CREATE TABLE IF NOT EXISTS `Addresses` (
  `address_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `addressType` ENUM('Shipping', 'Billing', 'Both') DEFAULT 'Shipping',
  `fullName` VARCHAR(255) NOT NULL,
  `streetAddress` VARCHAR(255) NOT NULL,
  `city` VARCHAR(255) NOT NULL,
  `province` VARCHAR(255) NOT NULL,
  `postalCode` VARCHAR(255) NOT NULL,
  `country` VARCHAR(255) DEFAULT 'South Africa',
  `phone` VARCHAR(255) NULL,
  `isDefault` TINYINT(1) DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`address_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ========================================
-- SECTION 4: Create PaymentMethods table
-- (This should work even if run multiple times due to IF NOT EXISTS)
-- ========================================
CREATE TABLE IF NOT EXISTS `PaymentMethods` (
  `payment_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `cardholderName` VARCHAR(255) NOT NULL,
  `cardType` ENUM('Visa', 'Mastercard', 'American Express', 'Other') DEFAULT 'Visa',
  `lastFourDigits` VARCHAR(4) NOT NULL,
  `expiryMonth` INT(11) NOT NULL,
  `expiryYear` INT(11) NOT NULL,
  `isDefault` TINYINT(1) DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `PaymentMethods_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ========================================
-- ✅ DONE! All tables should now be created.
-- ========================================
-- To verify, run this query:
-- SHOW TABLES;
-- 
-- You should see:
-- - Addresses
-- - PaymentMethods
-- 
-- And in Users table, run:
-- DESCRIBE Users;
-- 
-- You should see columns:
-- - profilePhoto
-- - phone
-- ========================================

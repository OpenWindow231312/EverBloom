-- ========================================
-- 🌸 EverBloom — Profile Features Migration
-- Add profile photo, addresses, and payment methods
-- ========================================

-- Update Users table to add profile photo and phone
ALTER TABLE `Users` 
ADD COLUMN `profilePhoto` VARCHAR(255) NULL DEFAULT NULL AFTER `isActive`,
ADD COLUMN `phone` VARCHAR(255) NULL DEFAULT NULL AFTER `profilePhoto`;

-- Create Addresses table
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

-- Create PaymentMethods table
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

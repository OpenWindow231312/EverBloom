-- ========================================
-- 🌸 EverBloom — Add Nickname to PaymentMethods
-- ========================================

-- Add nickname column to PaymentMethods table
ALTER TABLE `PaymentMethods` 
ADD COLUMN `nickname` VARCHAR(255) NULL DEFAULT NULL AFTER `cardholderName`;

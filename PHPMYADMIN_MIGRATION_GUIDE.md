# phpMyAdmin Migration Guide

## Step-by-Step Instructions for Running Migration in phpMyAdmin

### Option 1: Run Sections One at a Time (Recommended)

This is the **safest method** - run each section separately.

#### Step 1: Add profilePhoto Column

1. Login to phpMyAdmin on AlwaysData
2. Select database: `anikadebeer_everbloom_db`
3. Click on **SQL** tab at the top
4. Copy and paste this ONLY:

```sql
ALTER TABLE `Users` 
ADD COLUMN `profilePhoto` VARCHAR(255) NULL DEFAULT NULL;
```

5. Click **Go** or **Execute**
6. If you get **"Duplicate column name 'profilePhoto'"** - that's OK! It means the column already exists. Skip to Step 2.

---

#### Step 2: Add phone Column

1. In the same SQL tab, clear the previous query
2. Copy and paste this ONLY:

```sql
ALTER TABLE `Users`
ADD COLUMN `phone` VARCHAR(255) NULL DEFAULT NULL;
```

3. Click **Go** or **Execute**
4. If you get **"Duplicate column name 'phone'"** - that's OK! Skip to Step 3.

---

#### Step 3: Create Addresses Table

1. In the SQL tab, clear the previous query
2. Copy and paste this ENTIRE block:

```sql
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
```

3. Click **Go** or **Execute**
4. You should see: **"1 row affected"** or **"Query OK"**

---

#### Step 4: Create PaymentMethods Table

1. In the SQL tab, clear the previous query
2. Copy and paste this ENTIRE block:

```sql
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
```

3. Click **Go** or **Execute**
4. You should see: **"1 row affected"** or **"Query OK"**

---

### Verification

After running all 4 steps:

1. In phpMyAdmin, look at the left sidebar
2. You should see these tables listed:
   - ✅ Addresses
   - ✅ PaymentMethods
   - ✅ Users (already existed)

3. Click on **Users** table
4. Click **Structure** tab
5. Scroll down and verify you see:
   - ✅ profilePhoto column
   - ✅ phone column

---

### Option 2: Run All at Once (Advanced)

If you're comfortable with SQL, you can use the file:
`backend/migrations/add_profile_features_safe.sql`

1. Open the file in a text editor
2. Copy **ALL** the content
3. Paste into phpMyAdmin SQL tab
4. Click **Go**

phpMyAdmin will run each command sequentially. Some may fail if they already exist, but that's OK.

---

## Common Errors and Solutions

### Error: "Duplicate column name"
**Meaning:** Column already exists
**Solution:** Skip that section, it's already done

### Error: "Table already exists"
**Meaning:** Table was already created
**Solution:** Skip that section, it's already done

### Error: "Unknown column in AFTER clause"
**Meaning:** The original migration tried to place columns in specific order
**Solution:** Use the safe version (sections above) which doesn't use AFTER

### Error: "Can't create foreign key"
**Meaning:** Users table might not have user_id column, or it's not the right type
**Solution:** Check Users table structure. user_id should be INT(11) PRIMARY KEY

---

## What to Do After Migration

1. **Verify tables exist** (see Verification section above)

2. **Restart your backend:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Test the database connection:**
   ```bash
   node test-db-connection.js
   ```
   
   Should show:
   ```
   ✅ Found 16+ tables
   ✅ All required tables exist!
   ```

4. **Try login/signup again** - should work without 500 errors!

---

## Still Getting Errors?

If you're still seeing errors after the migration:

1. **Check backend console logs** when you try to login
   - Look for the actual error message after "❌ Login error:"
   
2. **Share the exact error** - paste the full error message so I can help

3. **Try creating a test user:**
   ```sql
   INSERT INTO Users (fullName, email, passwordHash, isActive, createdAt, updatedAt)
   VALUES ('Test User', 'test@test.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', 1, NOW(), NOW());
   ```
   
   Then try logging in with email: test@test.com

---

## Quick Reference

**Database:** anikadebeer_everbloom_db
**Host:** mysql-anikadebeer.alwaysdata.net
**User:** 434073

**New Tables to Create:**
1. Addresses
2. PaymentMethods

**New Columns in Users:**
1. profilePhoto
2. phone

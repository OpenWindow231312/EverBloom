# Database Updates - Review System for Flowers

## Overview
This folder contains SQL migration scripts for adding the review functionality to EverBloom.

## How to Import in phpMyAdmin

### Step 1: Access phpMyAdmin
1. Open phpMyAdmin in your browser
2. Login with your database credentials
3. Select your database: `anikadebeer_everbloom_db` (production) or `everbloom_db` (local)

### Step 2: Import SQL File
1. Click on the **Import** tab in phpMyAdmin
2. Click **Choose File** and select `add_review_system.sql`
3. Ensure **Character set** is set to `utf8mb4`
4. Click **Go** to execute the SQL script

### Step 3: Verify Changes
After import, verify that the `Reviews` table has been updated with the following structure:
- `review_id` (INT, Primary Key, Auto Increment)
- `flower_id` (INT, Foreign Key to Flowers table)
- `user_id` (INT, Foreign Key to Users table)
- `rating` (INT, 1-5)
- `heading` (VARCHAR 255)
- `comment` (TEXT)
- `image_url` (VARCHAR 500, nullable)
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)

## Files in this Folder

### `add_review_system.sql`
Main migration script that:
- Drops existing Reviews table (backs up data if needed)
- Creates new Reviews table with flower_id instead of order_id
- Adds heading and image_url fields
- Sets up proper foreign keys and indexes

## Important Notes
- **Backup First**: Always backup your database before running migrations
- The old Reviews table structure used `order_id`, the new one uses `flower_id`
- Existing review data will be lost unless you manually migrate it
- The script is idempotent - safe to run multiple times
- **The script will DROP the existing Reviews table** - this removes all old reviews

## Adding Sample Data
If you want to add sample data after running the migration:
1. Open the `add_review_system.sql` file
2. Uncomment the INSERT statements at the bottom (remove the `--` at the start of each line)
3. **Important**: Remove the `review_id` column from the INSERT statement - let it auto-increment
4. Make sure the user_id and flower_id values exist in your Users and Flowers tables
5. Run only the INSERT statements in phpMyAdmin

**Correct INSERT format** (without review_id):
```sql
INSERT INTO `Reviews` (`flower_id`, `user_id`, `rating`, `heading`, `comment`, `image_url`, `createdAt`, `updatedAt`) VALUES
(1, 2, 5, 'Absolutely Beautiful!', 'These roses are stunning!', NULL, NOW(), NOW());
```

## Troubleshooting

### "Duplicate entry '1' for key 'PRIMARY'" Error
This means the Reviews table already has data. To fix:
1. Either delete existing reviews: `DELETE FROM Reviews;`
2. Or let the review_id auto-increment by omitting it from your INSERT statement
3. Or use different review_id values that don't already exist

### "Unknown column 'Review.store_id'" Error  
This means the backend code associations need updating. The fix has been applied to use `flower_id` instead of `store_id`.

## Rollback
If you need to rollback these changes, you can restore from your backup or manually drop the table and recreate it from your previous SQL dump.

## Support
For any issues with the database migration, contact the development team or check the EverBloom documentation.

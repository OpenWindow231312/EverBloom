# Fixing 500 Login/Signup Errors

## The Problem

You're getting 500 Internal Server Error when trying to login or signup.

## Root Cause

The backend is trying to use the `Addresses` and `PaymentMethods` tables, but these tables don't exist in your database yet because the migration SQL script hasn't been run.

## Solution: Run the Migration

### Option 1: Using MySQL Command Line

```bash
# Navigate to the backend directory
cd backend

# Run the migration
mysql -h mysql-anikadebeer.alwaysdata.net -u 434073 -p anikadebeer_everbloom_db < migrations/add_profile_features.sql
# When prompted, enter password: Anika@22
```

### Option 2: Using AlwaysData phpMyAdmin

1. Login to your AlwaysData admin panel
2. Go to **Databases > MySQL**
3. Click on `anikadebeer_everbloom_db`
4. Go to the **SQL** tab
5. Open `backend/migrations/add_profile_features.sql` in a text editor
6. Copy all the SQL commands
7. Paste into the SQL tab
8. Click **Execute**

### Option 3: Use a GUI Tool (Recommended)

If you have MySQL Workbench, TablePlus, or similar:

1. Connect to database:
   - Host: `mysql-anikadebeer.alwaysdata.net`
   - Port: `3306`
   - User: `434073`
   - Password: `Anika@22`
   - Database: `anikadebeer_everbloom_db`

2. Open and run `backend/migrations/add_profile_features.sql`

## Verification

After running the migration, verify tables were created:

```bash
cd backend
node test-db-connection.js
```

You should see:
```
✅ Found 16 tables
✅ All required tables exist!
```

Including:
- Addresses
- PaymentMethods

## Then Restart Backend

```bash
cd backend
npm run dev
```

## Test Login/Signup

1. Go to `/signup`
2. Fill in the form
3. Click "Send Verification Code"
4. Enter the OTP (check console logs in development)
5. Complete signup
6. Try logging in

Should work without 500 errors!

---

## If You Don't Want to Run Migration Yet

If you prefer not to run the migration immediately, I can temporarily disable the Address and PaymentMethod features so login/signup works without them.

Let me know which approach you prefer!

---

## What the Migration Adds

The migration creates two new tables:

1. **Addresses** - For storing user shipping/billing addresses
2. **PaymentMethods** - For storing payment card information (last 4 digits only)

And adds two columns to Users table:
- `profilePhoto` - Path to user's profile picture
- `phone` - User's phone number

These are required for the Account/Profile page to work, but shouldn't prevent login/signup from working. The code has been updated to make these optional.

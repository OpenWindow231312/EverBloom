# Troubleshooting Auth Errors - EverBloom

## Common 401/500 Errors and Solutions

### Error: 401 Unauthorized on `/api/auth/me`

**Cause:** This endpoint requires authentication but is being called without a valid token.

**Solution:** This is expected behavior when not logged in. The frontend should handle this gracefully and redirect to login if needed.

**Fix in Frontend:**
The `/api/auth/me` endpoint should only be called when:
1. User has a token in localStorage
2. Token is included in Authorization header

Check if your frontend is calling this endpoint on initial page load without checking for a token first.

---

### Error: 500 Internal Server Error on `/api/auth/login` or `/api/auth/send-otp`

**Possible Causes:**

#### 1. Database Connection Issues
The backend cannot connect to the database.

**Check:**
```bash
# In backend directory, check your .env file has correct database credentials
cat .env
```

**Required .env variables:**
```env
NODE_ENV=development
DB_HOST=mysql-anikadebeer.alwaysdata.net  # or localhost for local
DB_USER=434073
DB_PASS=Anika@22
DB_NAME=anikadebeer_everbloom_db
DB_DIALECT=mysql
DB_PORT=3306
JWT_SECRET=your-secret-key
```

**Test database connection:**
```bash
# Try connecting to MySQL
mysql -h mysql-anikadebeer.alwaysdata.net -u 434073 -p anikadebeer_everbloom_db
```

#### 2. Database Tables Missing
The migration hasn't been run yet.

**Solution:**
```bash
# Connect to your database and run the migration SQL
mysql -h mysql-anikadebeer.alwaysdata.net -u 434073 -p anikadebeer_everbloom_db < backend/migrations/add_profile_features.sql
```

**Or use phpMyAdmin:**
1. Login to AlwaysData admin panel
2. Go to Databases > MySQL
3. Select `anikadebeer_everbloom_db`
4. Go to SQL tab
5. Copy and paste contents of `backend/migrations/add_profile_features.sql`
6. Execute

#### 3. Role Table Empty
The Roles table doesn't have the required roles.

**Solution (now automatic):**
The latest code now automatically creates roles if they don't exist. However, if you want to pre-populate them:

```sql
-- Connect to database and run:
INSERT INTO Roles (roleName, createdAt, updatedAt) VALUES 
('Customer', NOW(), NOW()),
('Florist', NOW(), NOW()),
('Employee', NOW(), NOW()),
('Admin', NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt=NOW();
```

#### 4. SSL Connection Issues (Development)
If running locally, SSL might cause connection issues.

**Solution:**
The code now automatically disables SSL in development mode. Make sure your `.env` has:
```env
NODE_ENV=development
```

For production (AlwaysData), use:
```env
NODE_ENV=production
```

---

## Step-by-Step Debugging

### 1. Check Backend Server Logs

Start the backend with detailed logging:
```bash
cd backend
npm run dev
```

Look for error messages in the console. Common errors:
- `ECONNREFUSED` - Database connection failed
- `SequelizeConnectionError` - Wrong database credentials
- `Table doesn't exist` - Migration not run
- `Column not found` - Database schema mismatch

### 2. Test Database Connection

Create a test file `backend/test-db-connection.js`:
```javascript
require('dotenv').config();
const { sequelize } = require('./models');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Test if tables exist
    const [results] = await sequelize.query('SHOW TABLES');
    console.log('📋 Tables in database:', results);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
```

Run it:
```bash
node backend/test-db-connection.js
```

### 3. Check Frontend API Calls

Open browser DevTools (F12) and check:

**Network Tab:**
- Are requests going to the correct URL?
- Are headers properly set?
- What's the actual error response?

**Console Tab:**
- Are there any JavaScript errors?
- Check the logged response objects

### 4. Verify Environment Variables

**Backend:**
```bash
cd backend
cat .env  # Make sure all variables are set
```

**Frontend:**
If using Vite, create `.env.local`:
```env
VITE_API_URL=http://localhost:5001
```

If using Create React App, create `.env`:
```env
REACT_APP_API_URL=http://localhost:5001
```

---

## Quick Fixes Applied in Latest Commit

✅ **SSL Configuration:** Now conditional - disabled in development, enabled in production
✅ **Role Auto-Creation:** Roles are automatically created if they don't exist
✅ **Better Error Logging:** Detailed error messages in development mode
✅ **Error Details:** 500 errors now include error message in development

---

## Testing the Fixes

### Test OTP Send:
```bash
curl -X POST http://localhost:5001/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","fullName":"Test User"}'
```

Expected: 200 OK with message
Error: Check backend logs for details

### Test Registration:
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"test123",
    "fullName":"Test User",
    "role":"Customer"
  }'
```

Expected: 200 OK with token
Error: Check backend logs for details

### Test Login:
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

Expected: 200 OK with token and user object
Error: Check backend logs for details

---

## Still Having Issues?

### Enable Debug Mode

In `backend/.env`:
```env
NODE_ENV=development
DEBUG=*
```

Restart backend and check logs for detailed Sequelize queries and errors.

### Check Database Tables

Connect to database and verify tables exist:
```sql
SHOW TABLES;
DESCRIBE Users;
DESCRIBE Roles;
DESCRIBE UserRoles;
DESCRIBE Addresses;
DESCRIBE PaymentMethods;
```

### Verify Data

Check if you have any existing users and roles:
```sql
SELECT * FROM Roles;
SELECT * FROM Users LIMIT 5;
SELECT * FROM UserRoles LIMIT 5;
```

---

## Contact Points

If issues persist after following this guide:
1. Check backend console logs for specific error messages
2. Verify database credentials are correct
3. Ensure database migration has been run
4. Make sure NODE_ENV is set correctly
5. Check browser DevTools Network tab for actual error responses

The latest code improvements should resolve most common issues automatically.

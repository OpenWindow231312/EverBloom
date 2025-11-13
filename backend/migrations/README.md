# Profile Features Deployment Guide

## Database Migration

This guide explains how to deploy the profile features (profile photo, addresses, payment methods) to the production database.

### Prerequisites
- Access to AlwaysData MySQL database
- MySQL client or phpMyAdmin access

### Migration Steps

#### Option 1: Using MySQL Command Line

1. Connect to the production database:
```bash
mysql -h mysql-anikadebeer.alwaysdata.net -u 434073 -p anikadebeer_everbloom_db
```

2. Run the migration script:
```bash
mysql -h mysql-anikadebeer.alwaysdata.net -u 434073 -p anikadebeer_everbloom_db < backend/migrations/add_profile_features.sql
```

#### Option 2: Using phpMyAdmin (AlwaysData)

1. Log in to AlwaysData admin panel: https://admin.alwaysdata.com
2. Navigate to Databases > MySQL
3. Click on `anikadebeer_everbloom_db`
4. Go to the SQL tab
5. Copy and paste the contents of `backend/migrations/add_profile_features.sql`
6. Click "Execute"

### Verification

After running the migration, verify the changes:

```sql
-- Check if new columns were added to Users table
DESCRIBE Users;

-- Check if Addresses table was created
SHOW TABLES LIKE 'Addresses';
DESCRIBE Addresses;

-- Check if PaymentMethods table was created
SHOW TABLES LIKE 'PaymentMethods';
DESCRIBE PaymentMethods;
```

### Environment Variables

Ensure these environment variables are set in production (Render):

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
JWT_SECRET=your-secure-secret-key
```

### Email Configuration

For OTP functionality, you need to configure email sending:

1. **Gmail Setup** (Recommended for development):
   - Enable 2-factor authentication on your Gmail account
   - Generate an App Password: https://myaccount.google.com/apppasswords
   - Use the app password in EMAIL_PASSWORD environment variable

2. **Alternative Email Services**:
   - SendGrid
   - AWS SES
   - Mailgun

Update `backend/utils/emailService.js` with your preferred email service configuration.

### Testing

After deployment, test the following features:

1. **Password Visibility Toggle**
   - Visit login/signup pages
   - Click eye icon to show/hide password

2. **OTP Verification**
   - Sign up with a new account
   - Check for OTP email
   - Verify OTP code works

3. **Profile Management**
   - Log in
   - Navigate to /account page
   - Test profile photo upload
   - Add/edit/delete addresses
   - Add/delete payment methods

### Rollback

If you need to rollback the changes:

```sql
-- Remove new tables
DROP TABLE IF EXISTS PaymentMethods;
DROP TABLE IF EXISTS Addresses;

-- Remove new columns from Users table
ALTER TABLE Users 
  DROP COLUMN profilePhoto,
  DROP COLUMN phone;
```

### Security Notes

- Profile photo uploads are stored in `backend/uploads/profiles/` directory
- Ensure proper file permissions on the uploads directory
- Maximum file size is set to 5MB
- Only image files (jpeg, jpg, png, gif) are allowed
- Payment card information stores only last 4 digits (never store full card numbers)
- All profile endpoints require authentication
- Rate limiting is applied to prevent abuse

### Support

For issues or questions, contact the development team.

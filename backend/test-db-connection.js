// ========================================
// 🌸 EverBloom — Database Connection Test
// ========================================
require('dotenv').config();
const { sequelize } = require('./models');

async function testConnection() {
  console.log('🧪 Testing EverBloom Database Connection...\n');
  
  console.log('📋 Configuration:');
  console.log(`  Host: ${process.env.DB_HOST || 'NOT SET'}`);
  console.log(`  Database: ${process.env.DB_NAME || 'NOT SET'}`);
  console.log(`  User: ${process.env.DB_USER || 'NOT SET'}`);
  console.log(`  Dialect: ${process.env.DB_DIALECT || 'mysql'}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}\n`);

  try {
    // Test connection
    console.log('⏳ Attempting to connect to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful!\n');
    
    // List tables
    console.log('📋 Checking database tables...');
    const [results] = await sequelize.query('SHOW TABLES');
    
    if (results.length === 0) {
      console.log('⚠️  No tables found in database!');
      console.log('   You need to run the migration script.');
      console.log('   See: backend/migrations/README.md\n');
    } else {
      console.log(`✅ Found ${results.length} tables:\n`);
      results.forEach((row, index) => {
        const tableName = Object.values(row)[0];
        console.log(`   ${index + 1}. ${tableName}`);
      });
      console.log('');
    }
    
    // Check for required tables
    const tableNames = results.map(row => Object.values(row)[0]);
    const requiredTables = ['Users', 'Roles', 'UserRoles', 'Addresses', 'PaymentMethods'];
    const missingTables = requiredTables.filter(t => !tableNames.includes(t));
    
    if (missingTables.length > 0) {
      console.log('⚠️  Missing required tables:');
      missingTables.forEach(table => {
        console.log(`   ✗ ${table}`);
      });
      console.log('\n   Run the migration script to create these tables.');
      console.log('   See: backend/migrations/README.md\n');
    } else {
      console.log('✅ All required tables exist!\n');
      
      // Check Roles
      const [roleResults] = await sequelize.query('SELECT * FROM Roles');
      if (roleResults.length === 0) {
        console.log('⚠️  Roles table is empty!');
        console.log('   Roles will be created automatically on first signup.\n');
      } else {
        console.log(`✅ Found ${roleResults.length} roles:`);
        roleResults.forEach(role => {
          console.log(`   - ${role.roleName}`);
        });
        console.log('');
      }
    }
    
    console.log('✅ Database test complete!');
    console.log('   Backend is ready to start.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed!\n');
    console.error('Error:', error.message);
    console.error('\nPossible solutions:');
    console.error('  1. Check your .env file has correct database credentials');
    console.error('  2. Verify database server is running and accessible');
    console.error('  3. For AlwaysData, ensure remote connections are enabled');
    console.error('  4. Check firewall settings\n');
    console.error('Full error details:', error);
    
    process.exit(1);
  }
}

testConnection();

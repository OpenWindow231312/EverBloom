require('dotenv').config();
const { sequelize } = require('./models');

async function checkTables() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');
    
    // Check for Users table
    const [users] = await sequelize.query('SELECT COUNT(*) as count FROM Users');
    console.log(`Users table: ${users[0].count} records`);
    
    // Check for Roles table
    const [roles] = await sequelize.query('SELECT * FROM Roles');
    console.log(`Roles table: ${roles.length} records`);
    if (roles.length > 0) {
      roles.forEach(r => console.log(`  - ${r.roleName} (ID: ${r.role_id})`));
    }
    
    // Check for UserRoles table
    const [userRoles] = await sequelize.query('SELECT COUNT(*) as count FROM UserRoles');
    console.log(`UserRoles table: ${userRoles[0].count} records\n`);
    
    // Check for Addresses table
    try {
      const [addresses] = await sequelize.query('SELECT COUNT(*) as count FROM Addresses');
      console.log(`Addresses table: ${addresses[0].count} records`);
    } catch (e) {
      console.log('⚠️ Addresses table does not exist');
    }
    
    // Check for PaymentMethods table  
    try {
      const [payments] = await sequelize.query('SELECT COUNT(*) as count FROM PaymentMethods');
      console.log(`PaymentMethods table: ${payments[0].count} records`);
    } catch (e) {
      console.log('⚠️ PaymentMethods table does not exist');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

checkTables();

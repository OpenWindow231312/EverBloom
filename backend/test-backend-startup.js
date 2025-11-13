// Test script to verify backend starts without errors
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

console.log('🧪 Testing EverBloom Backend Startup...\n');

try {
  console.log('1. Loading middleware...');
  const { requireAuth, requireRole } = require('./middleware/authMiddleware');
  const { apiLimiter, authLimiter, otpLimiter, uploadLimiter } = require('./middleware/rateLimiter');
  console.log('   ✓ Middleware loaded successfully\n');

  console.log('2. Loading routes...');
  const authRoutes = require('./routes/authRoutes');
  const profileRoutes = require('./routes/profileRoutes');
  const userRoutes = require('./routes/userRoutes');
  const flowerRoutes = require('./routes/flowerRoutes');
  const harvestRoutes = require('./routes/harvestRoutes');
  const inventoryRoutes = require('./routes/inventoryRoutes');
  const orderRoutes = require('./routes/orderRoutes');
  const discardRoutes = require('./routes/discardRoutes');
  const deliveryRoutes = require('./routes/deliveryRoutes');
  const reviewRoutes = require('./routes/reviewRoutes');
  const stockRoutes = require('./routes/stockRoutes');
  const dashboardRoutes = require('./routes/dashboardRoutes');
  const shopRoutes = require('./routes/shopRoutes');
  console.log('   ✓ All routes loaded successfully\n');

  console.log('3. Loading utilities...');
  const { sendOTP, verifyOTP } = require('./utils/emailService');
  console.log('   ✓ Utilities loaded successfully\n');

  console.log('4. Testing Express app setup...');
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/profile', profileRoutes);
  console.log('   ✓ Express app configured successfully\n');

  console.log('✅ SUCCESS: Backend code is valid and ready to start!');
  console.log('\nNote: Database connection is required for full operation.');
  console.log('Set DB_HOST, DB_USER, DB_PASS, DB_NAME environment variables.\n');
  
  process.exit(0);
} catch (error) {
  console.error('❌ ERROR: Backend startup test failed!');
  console.error('Error:', error.message);
  console.error('\nStack trace:');
  console.error(error.stack);
  process.exit(1);
}

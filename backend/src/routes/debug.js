import express from 'express';

const router = express.Router();

// Debug endpoint to test admin credentials
router.post('/test-admin-login', (req, res) => {
  console.log('🔍 DEBUG ENDPOINT - Request received');
  console.log('🔍 Request body:', req.body);
  console.log('🔍 Headers:', req.headers);
  
  const { email, password } = req.body;
  
  console.log('🔍 Email:', email);
  console.log('🔍 Password:', password ? '***' : 'MISSING');
  console.log('🔍 Email comparison:', email === 'saremworkuu@gmail.com');
  console.log('🔍 Password comparison:', password === 'admin123');
  
  // Handle potential whitespace issues
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  const cleanPassword = password ? password.trim() : '';
  
  console.log('🔍 Clean email:', cleanEmail);
  console.log('🔍 Clean password:', cleanPassword ? '***' : 'MISSING');
  console.log('🔍 Clean email comparison:', cleanEmail === 'saremworkuu@gmail.com');
  console.log('🔍 Clean password comparison:', cleanPassword === 'admin123');
  
  if (cleanEmail === 'saremworkuu@gmail.com' && cleanPassword === 'admin123') {
    console.log('🔍 SUCCESS: Admin credentials matched!');
    return res.json({
      success: true,
      message: 'Admin credentials are correct',
      email: cleanEmail,
      passwordMatch: cleanPassword === 'admin123'
    });
  } else {
    console.log('🔍 FAILED: Admin credentials did not match');
    return res.json({
      success: false,
      message: 'Admin credentials are incorrect',
      email: cleanEmail,
      expectedEmail: 'saremworkuu@gmail.com',
      emailMatch: cleanEmail === 'saremworkuu@gmail.com',
      passwordMatch: cleanPassword === 'admin123'
    });
  }
});

// Simple health check endpoint
router.get('/health', (req, res) => {
  console.log('🔍 Health check received');
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test JWT secret
router.get('/check-jwt', (req, res) => {
  console.log('🔍 JWT secret check');
  res.json({
    jwtSecretExists: !!process.env.JWT_SECRET,
    jwtSecretLength: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0
  });
});

export default router;

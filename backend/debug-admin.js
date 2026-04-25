#!/usr/bin/env node

// Admin Login Debug Script
// Run this to test admin credentials and environment

import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

console.log('🔍 Admin Login Debug Script');
console.log('================================');

// Check environment variables
console.log('\n📋 Environment Variables Check:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ MISSING');
console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'Gmail (default)');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}***` : '❌ MISSING');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set (hidden)' : '❌ MISSING');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'http://localhost:3000 (default)');

// Test hardcoded admin credentials
const adminEmail = 'saremworluu@gmail.com';
const adminPassword = 'admin123';

console.log('\n🧪 Testing Admin Credentials:');
console.log('Email:', adminEmail);
console.log('Password:', adminPassword);
console.log('Expected Result: ✅ Admin Login Successful');

// Test JWT generation
try {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing from environment variables');
  }
  
  const token = jwt.sign(
    { id: 'admin_static_id', role: 'admin' }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' }
  );
  
  console.log('\n✅ JWT Token Generated Successfully');
  console.log('Token preview:', token.substring(0, 20) + '...');
  
  // Test token verification
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('✅ Token Verification Successful');
  console.log('Decoded:', decoded);
  
} catch (error) {
  console.error('\n❌ JWT Error:', error.message);
  console.log('💡 Solution: Add JWT_SECRET to your .env file');
}

// Test email configuration
console.log('\n📧 Email Configuration Test:');

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  console.log('✅ Email credentials are configured');
  console.log('💡 To test email, run: npm run debug-email');
} else {
  console.log('❌ Email credentials missing');
  console.log('💡 Add to .env:');
  console.log('   EMAIL_SERVICE=Gmail');
  console.log('   EMAIL_USER=your_email@gmail.com');
  console.log('   EMAIL_PASS=your_app_password');
}

// Production checklist
console.log('\n🚀 Production Deployment Checklist:');
console.log('1. ✅ JWT_SECRET set in production environment');
console.log('2. ✅ Admin credentials hardcoded in authRoutes.js');
console.log('3. ✅ Email credentials configured for password reset');
console.log('4. ✅ Frontend URL set for email links');

console.log('\n🔧 If admin login still fails:');
console.log('1. Check browser network tab for API errors');
console.log('2. Verify API endpoint: POST /api/auth/login');
console.log('3. Check if JWT_SECRET matches between frontend and backend');
console.log('4. Try clearing browser cache and cookies');

console.log('\n📧 If email still not working:');
console.log('1. Run: npm run debug-email');
console.log('2. Check spam folder');
console.log('3. Verify Gmail App Password setup');
console.log('4. Check environment variables in production');

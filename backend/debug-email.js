#!/usr/bin/env node

// Email Debugging Script
// Run this script to test email configuration independently

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

console.log('🔍 Email Configuration Debug Script');
console.log('=====================================');

// Check environment variables
console.log('\n📋 Environment Variables Check:');
console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'Gmail (default)');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}***` : '❌ MISSING');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set (hidden)' : '❌ MISSING');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('\n❌ CRITICAL: EMAIL_USER or EMAIL_PASS is missing!');
  console.log('\n💡 Solution:');
  console.log('1. Open your .env file');
  console.log('2. Add these lines:');
  console.log('   EMAIL_SERVICE=Gmail');
  console.log('   EMAIL_USER=your_email@gmail.com');
  console.log('   EMAIL_PASS=your_app_password');
  console.log('3. For Gmail: Generate App Password at https://myaccount.google.com/apppasswords');
  process.exit(1);
}

async function testEmailConfig() {
  console.log('\n🧪 Testing Email Configuration...');
  
  try {
    // Create transporter with debug options
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true,
      logger: true,
    });

    console.log('📡 Verifying transporter...');
    await transporter.verify();
    console.log('✅ Transporter verification successful!');

    // Test sending email
    console.log('📤 Sending test email...');
    
    const testEmail = {
      from: `"LuxeCart Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: '🧪 Email Configuration Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">✅ Email Test Successful!</h2>
          <p>This email confirms that your LuxeCart email configuration is working correctly.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Test Details:</h3>
            <ul>
              <li><strong>Service:</strong> ${process.env.EMAIL_SERVICE || 'Gmail'}</li>
              <li><strong>From:</strong> ${process.env.EMAIL_USER}</li>
              <li><strong>To:</strong> ${process.env.EMAIL_USER}</li>
              <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
            </ul>
          </div>
          <p style="color: #666;">If you received this email, your password reset functionality should work!</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">This is an automated test from LuxeCart Email Debug Script</p>
        </div>
      `,
    };

    const result = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📍 Check your inbox (and spam folder)');
    
  } catch (error) {
    console.error('\n❌ Email Test Failed!');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    
    // Specific troubleshooting
    console.log('\n🔧 Troubleshooting:');
    
    if (error.code === 'EAUTH') {
      console.log('🔐 Authentication Error - Solutions:');
      console.log('1. Enable 2-Factor Authentication on your Gmail account');
      console.log('2. Generate App Password at: https://myaccount.google.com/apppasswords');
      console.log('3. Use the 16-character App Password (not your regular password)');
      console.log('4. Make sure EMAIL_USER is your full Gmail address');
    } else if (error.code === 'ECONNECTION') {
      console.log('🌐 Connection Error - Solutions:');
      console.log('1. Check your internet connection');
      console.log('2. Try different EMAIL_SERVICE (Outlook365, Yahoo)');
      console.log('3. Check if firewall is blocking SMTP');
    } else if (error.code === 'ESOCKET') {
      console.log('🔌 Socket Error - Solutions:');
      console.log('1. Try different port (Gmail uses 587 for TLS)');
      console.log('2. Check antivirus/firewall settings');
    }
    
    process.exit(1);
  }
}

// Alternative email configurations
console.log('\n🔄 Alternative Email Services:');
console.log('If Gmail doesn\'t work, try these:');
console.log('\nOutlook/Hotmail:');
console.log('EMAIL_SERVICE=Outlook365');
console.log('EMAIL_USER=your_email@outlook.com');
console.log('EMAIL_PASS=your_app_password');

console.log('\nYahoo:');
console.log('EMAIL_SERVICE=Yahoo');
console.log('EMAIL_USER=your_email@yahoo.com');
console.log('EMAIL_PASS=your_app_password');

console.log('\nStarting email test...\n');
testEmailConfig().catch(console.error);

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.js';
import { Protect } from '../middleware/auth.js';
import sendEmail from '../utils/sendEmail.js';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();

// Rate limiter for password reset endpoints
const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { message: 'Too many password reset requests, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== REGISTER ====================
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, role = 'user' } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash password ONLY ONCE here
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const user = new User({
      fullName: fullName,
      email: email.toLowerCase(),
      passwordHash,
      role,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationTokenExpires
    });

    await user.save();

    // Send confirmation email
    const frontendBaseUrl = process.env.FRONTEND_URL || 'https://e-commerce-csec-astu-bootcamp-oz28k3wdb.vercel.app';
    const verificationUrl = `${frontendBaseUrl.replace(/\/$/, '')}/confirm-email?token=${verificationToken}`;
    try {
      await sendEmail({
        email: user.email,
        subject: 'Email Confirmation - E-Commerce',
        message: `<p>Please confirm your email by clicking on the following link:</p>
                  <a href="${verificationUrl}">${verificationUrl}</a>`,
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return res.status(500).json({ message: 'User registered, but failed to send confirmation email', error: emailError.message });
    }

    res.status(201).json({ 
      message: 'User registered successfully. Please check your email to verify your account.',
      user: { id: user._id, fullName: user.fullName, email: user.email, role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== VERIFY EMAIL ====================
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    const authToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Email verified successfully',
      token: authToken,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== LOGIN ====================

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Special case for hardcoded admin login
    if (email === 'saremworkuu@gmail.com' && password === 'admin123') {
      const token = jwt.sign({ id: 'admin_static_id', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        message: 'Admin login successful',
        token,
        user: {
          id: 'admin_static_id',
          fullName: 'System Admin',
          email: 'saremworkuu@gmail.com',
          role: 'admin',
          createdAt: new Date()
        }
      });
    }

    // Important: Search with lowercase
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // ** Email Verification Block Removed **
    // The user can now log in without being blocked by unverified email.

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      message: 'Login successful',
      token,
      user: { 
        id: user._id, 
        fullName: user.fullName, 
        email: user.email, 
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// In your auth router file (routes/auth.js)
router.get('/me', Protect, async (req, res) => {
  try {
    if (req.user.role === 'admin' && req.user.id === 'admin_static_id') {
      return res.json({
        id: 'admin_static_id',
        fullName: 'System Admin',
        email: 'saremworkuu@gmail.com',
        role: 'admin',
        createdAt: new Date()
      });
    }

    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== FORGOT PASSWORD ====================
router.post('/forgot-password', resetLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If an account exists with that email, a reset link has been sent.' });
    }

    // Generate random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash and save token with expiration (20 minutes)
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 20 * 60 * 1000;

    await user.save();

    // Reset URL
    const frontendBaseUrl = process.env.FRONTEND_URL || 'https://e-commerce-csec-astu-bootcamp-oz28k3wdb.vercel.app';
    const resetUrl = `${frontendBaseUrl.replace(/\/$/, '')}/reset-password?token=${resetToken}`;

    const message = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: 0 auto;">
        <div style="padding: 40px 20px; text-align: center;">
          <h2 style="color: #000; font-size: 28px; margin-bottom: 20px; font-weight: 700;">Password Reset Request</h2>
          <p style="color: #666; font-size: 16px; margin-bottom: 30px; line-height: 1.5;">You requested a password reset for your LuxeCart account. Click the button below to set a new password:</p>
          
          <!-- Mobile-optimized button -->
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block; background-color: #000; color: #fff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; min-width: 200px;"
               target="_blank"
               rel="noopener noreferrer">
              Reset Password
            </a>
          </div>
          
          <!-- Fallback link for email clients that don't support buttons -->
          <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 8px;">
            <p style="color: #666; font-size: 14px; margin: 0;">If the button doesn't work, copy and paste this link into your browser:</p>
            <a href="${resetUrl}" 
               style="color: #000; font-size: 12px; word-break: break-all; text-decoration: underline;"
               target="_blank"
               rel="noopener noreferrer">
              ${resetUrl}
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px;">This link will expire in 20 minutes. If you did not request this, please ignore this email.</p>
          <p style="color: #999; font-size: 14px; margin-top: 10px;">Best regards,<br>The LuxeCart Team</p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request - LuxeCart',
        message,
      });
      res.json({ message: 'If an account exists with that email, a reset link has been sent.' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      console.error('Email error:', err);
      res.status(500).json({ message: 'Error sending reset email' });
    }
router.post('/reset-password', resetLimiter, async (req, res) => {
  try {
    const { token, password } = req.body;

    console.log('🔍 Reset Password Debug:');
    console.log('Token received:', token ? '✅ Present' : '❌ Missing');
    console.log('Password length:', password ? password.length : '❌ Missing');
    console.log('Request timestamp:', new Date().toISOString());

    if (!token || !password) {
      console.log('❌ Missing token or password');
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Hash the token from URL to compare with stored hashed token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    console.log('Token hashed for comparison');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    console.log('User found:', user ? '✅' : '❌');
    if (user) {
      console.log('Token expires at:', new Date(user.resetPasswordExpires).toISOString());
      console.log('Current time:', new Date().toISOString());
      console.log('Token valid:', user.resetPasswordExpires > Date.now() ? '✅' : '❌');
    }

    if (!user) {
      console.log('❌ Invalid or expired reset token');
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    console.log('✅ Token validated, updating password...');
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);

    // Invalidate reset token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    console.log('✅ Password updated successfully');

    res.json({ message: 'Password reset successful. You can now log in with your new password.' });
  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required for testing' });
    }

    console.log('🧪 Testing email functionality...');
    
    const testMessage = `
      <div style="font-family: sans-serif; line-height: 1.6; color: #111;">
        <h2>🧪 Email Test - LuxeCart</h2>
        <p>This is a test email to verify that the email system is working correctly.</p>
        <div style="margin: 30px 0; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
          <p><strong>Test Details:</strong></p>
          <ul>
            <li>Timestamp: ${new Date().toLocaleString()}</li>
            <li>Environment: ${process.env.NODE_ENV || 'development'}</li>
            <li>Email Service: ${process.env.EMAIL_SERVICE || 'Gmail'}</li>
            <li>From: ${process.env.EMAIL_USER || 'Not configured'}</li>
          </ul>
        </div>
        <p>If you receive this email, the email system is working properly! 🎉</p>
        <p>Best regards,<br>The LuxeCart Team</p>
      </div>
    `;

    await sendEmail({
      email: email,
      subject: '🧪 Email Test - LuxeCart System',
      message: testMessage,
    });

    res.json({ 
      message: 'Test email sent successfully! Please check your inbox (and spam folder).',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Test email failed:', error);
    res.status(500).json({ 
      message: 'Test email failed',
      error: error.message,
      code: error.code || 'UNKNOWN'
    });
  }
});

export default router;
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.js';
import { Protect } from '../middleware/auth.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

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
    const frontendBaseUrl = process.env.FRONTEND_URL || req.get('origin') || 'http://localhost:3000';
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

    // Important: Search with lowercase
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isEmailVerified) {
      return res.status(401).json({ message: 'Please verify your email before logging in.' });
    }

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

export default router;
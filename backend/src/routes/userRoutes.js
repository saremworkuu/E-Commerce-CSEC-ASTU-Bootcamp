import express from 'express';
import User from '../models/user.js';
import { Protect } from '../middleware/auth.js';

const router = express.Router();

// ==================== ADMIN ONLY ====================

// Get all users (for Admin Dashboard)
router.get('/', Protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const users = await User.find()
      .select('-passwordHash')   // Don't send password
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current logged in user profile
router.get('/me', Protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update current user profile
router.put('/profile', Protect, async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (fullName) user.fullName = fullName;
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser && String(existingUser._id) !== String(user._id)) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email.toLowerCase();
    }


    await user.save();
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


export default router;
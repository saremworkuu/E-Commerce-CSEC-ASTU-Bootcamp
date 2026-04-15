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

export default router;
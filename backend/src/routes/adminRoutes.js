import express from 'express';
import User from '../models/user.js';
import Product from '../models/product.js';
import Order from '../models/order.js';
import Message from '../models/message.js';
import { Protect } from '../middleware/auth.js';

const router = express.Router();

// Helper to ensure user is admin
const ensureAdmin = (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403).json({ message: 'Access denied. Admin only.' });
    return false;
  }
  return true;
};

// Apply protection to all admin routes
router.use(Protect);

// GET Admin stats
router.get('/stats', async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const [totalUsers, totalProducts, totalOrders, pendingOrders, revenueResult, totalMessages] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.aggregate([
        { $match: { status: { $in: ['shipped', 'delivered'] } } },
        { $group: { _id: null, revenue: { $sum: '$totalPrice' } } }
      ]),
      Message.countDocuments()
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      totalMessages,
      totalRevenue: revenueResult[0]?.revenue || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all users
router.get('/users', async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;
    
    const limit = parseInt(req.query.limit) || 0;
    const users = await User.find({}, '-password')
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user (Admin)
router.put('/users/:id', async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const { fullName, email, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (fullName) user.fullName = fullName;
    if (role) user.role = role;
    if (email) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing && String(existing._id) !== String(user._id)) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email.toLowerCase();
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle Suspend (Admin)
router.patch('/users/:id/suspend', async (req, res) => {
  try {
    console.log('🔄 Backend: Suspend request received');
    console.log('🔄 Backend: Request params:', req.params);
    console.log('🔄 Backend: Request user:', req.user);
    console.log('🔄 Backend: User ID to suspend:', req.params.id);
    console.log('🔄 Backend: Admin user ID:', req.user.id);
    console.log('🔄 Backend: Admin user role:', req.user.role);
    
    if (!ensureAdmin(req, res)) return;
    
    console.log('🔄 Backend: Admin check passed, finding user');
    const user = await User.findById(req.params.id);
    
    if (!user) {
      console.log('🔄 Backend: User not found with ID:', req.params.id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('🔄 Backend: User found:', user.email);
    console.log('🔄 Backend: Current suspension status:', user.isSuspended);
    
    user.isSuspended = !user.isSuspended;
    console.log('🔄 Backend: New suspension status:', user.isSuspended);
    
    await user.save();
    console.log('🔄 Backend: User saved successfully');
    
    res.json({ 
      message: `User ${user.isSuspended ? 'suspended' : 'activated'}`, 
      isSuspended: user.isSuspended 
    });
  } catch (error) {
    console.error('🔄 Backend: Suspend user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all messages
router.get('/messages', async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const limit = parseInt(req.query.limit) || 0;
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

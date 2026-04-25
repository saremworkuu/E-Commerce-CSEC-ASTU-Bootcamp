import express from 'express';
import User from '../models/user.js';
import Product from '../models/product.js';
import Order from '../models/order.js';
import Message from '../models/message.js';
import { Protect } from '../middleware/auth.js';

const router = express.Router();

router.use(Protect);

const ensureAdmin = (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403).json({ message: 'Access denied. Admin only.' });
    return false;
  }

  return true;
};

router.get('/users', async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const users = await User.find()
      .select('-passwordHash -__v')
      .sort({ createdAt: -1 });

    res.json(users);
    console.log('Fetched users:', users);
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) {
      return;
    }

    const [totalUsers, totalProducts, totalOrders, pendingOrders, revenueResult] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.aggregate([
        { $match: { status: { $in: ['shipped', 'delivered'] } } },
        { $group: { _id: null, revenue: { $sum: '$totalPrice' } } }
      ])
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue: revenueResult[0]?.revenue || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/messages', async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) {
      return;
    }

    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/messages/:id', async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) {
      return;
    }

    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error('Failed to fetch message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/messages/:id', async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) {
      return;
    }

    const allowedStatuses = ['unread', 'read', 'replied'];
    const nextStatus = String(req.body.status || '').toLowerCase();

    if (!allowedStatuses.includes(nextStatus)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const updated = await Message.findByIdAndUpdate(
      req.params.id,
      { status: nextStatus },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Failed to update message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/messages/:id', async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) {
      return;
    }

    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Failed to delete message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
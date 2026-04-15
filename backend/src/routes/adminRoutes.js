import express from 'express';
import User from '../models/user.js';
import Product from '../models/product.js';
import Order from '../models/order.js';
import { Protect } from '../middleware/auth.js';

const router = express.Router();

router.use(Protect);

router.get('/stats', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
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

export default router;
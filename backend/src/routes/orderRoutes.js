import express from 'express';
import Order from '../models/order.js';
import { Protect } from '../middleware/auth.js';
import nodemailer from 'nodemailer';

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ FIX: convert orderId to string before slice
const sendStatusEmail = async (email, orderId, newStatus, customerName) => {
  const shortId = orderId.toString().slice(-8).toUpperCase();

  const subject = `Your Order #${shortId} Status Updated`;
  
  let message = '';
  switch (newStatus) {
    case 'processing':
      message = `Hi ${customerName}, your order is now being processed.`;
      break;
    case 'shipped':
      message = `Great news! Your order has been shipped.`;
      break;
    case 'delivered':
      message = `Your order has been delivered. Thank you for shopping with us!`;
      break;
    case 'cancelled':
      message = `Your order has been cancelled.`;
      break;
    default:
      message = `Your order status has been updated to ${newStatus}.`;
  }

  const mailOptions = {
    from: `"Feysel Store" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: `
      <h2>Order Update</h2>
      <p>Dear ${customerName},</p>
      <p>${message}</p>
      <p><strong>Order ID:</strong> #${shortId}</p>
      <p>Thank you for your business!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email} for status: ${newStatus}`);
  } catch (emailError) {
    console.error('Failed to send email:', emailError);
  }
};

// ==================== USER ROUTES ====================

// Create new order
router.post('/', Protect, async (req, res) => {
  try {
    const { items, totalPrice, shippingInfo, paymentInfo } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    if (!shippingInfo || !shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.email) {
      return res.status(400).json({ message: 'Shipping information is required' });
    }

    const lastFourDigits = paymentInfo?.cardNumber ? paymentInfo.cardNumber.slice(-4) : '';

    const order = new Order({
      userId: req.user.id,
      items,
      totalPrice,
      shippingInfo,
      paymentInfo: {
        cardType: paymentInfo?.cardType || 'visa',
        cardHolder: paymentInfo?.cardHolder || '',
        lastFourDigits,
      },
      status: 'pending'
    });

    await order.save();
    
    res.status(201).json({
      message: 'Order placed successfully',
      orderId: order._id,
      order
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      message: 'Failed to place order', 
      error: error.message 
    });
  }
});

// Get all orders of logged-in user
router.get('/', Protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.productId', 'name price imageUrl')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== ADMIN ROUTES ====================

// Get ALL orders for Admin Dashboard 
router.get('/admin', Protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const orders = await Order.find()
      .populate({
        path: 'userId',
        select: 'email fullName',
        strictPopulate: false
      })
      .populate('items.productId', 'name price imageUrl')
      .sort({ createdAt: -1 })
      .lean();

    const safeOrders = orders.map(order => ({
      ...order,
      userId: order.userId || {
        fullName: 'Unknown',
        email: order.shippingInfo?.email || 'N/A'
      }
    }));

    res.json(safeOrders);

  } catch (error) {
    console.error('Admin get orders ERROR:', error);

    res.status(500).json({ 
      message: 'Failed to load orders',
      error: error.message 
    });
  }
});

// Get single order by ID (for user)
router.get('/:id', Protect, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    }).populate('items.productId', 'name price imageUrl');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    res.json(order);
  } catch (error) {
    console.error('Get single order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status + Send Email Notification
router.put('/:id/status', Protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { status } = req.body;

    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // ✅ FIX: remove deprecated "new", use returnDocument
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: 'after' }
    )
    .populate('items.productId', 'name price imageUrl')
    .populate('userId', 'fullName email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const customerName = `${order.userId.fullName}`;

    await sendStatusEmail(order.shippingInfo.email, order._id, status, customerName);

    res.json({
      message: `Order status updated to ${status} and email sent`,
      order
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

export default router;
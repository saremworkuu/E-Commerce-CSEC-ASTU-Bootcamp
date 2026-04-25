import express from 'express';
import Cart from '../models/cart.js';
import { Protect } from '../middleware/auth.js';

const router = express.Router();

// ================= GET CART =================
router.get('/', Protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id })
      .populate('items.productId', 'name price imageUrl stock');

    if (!cart) {
      return res.json({ userId: req.user.id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= ADD TO CART =================
router.post('/add', Protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const existing = cart.items.find(
      item => String(item.productId) === String(productId)
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    // Populate after save to send back full details
    const populatedCart = await Cart.findById(cart._id).populate('items.productId', 'name price imageUrl stock');
    res.json(populatedCart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ================= REMOVE ITEM =================
router.delete('/remove/:productId', Protect, async (req, res) => {
  try {
    console.log('🗑️ Cart: Remove request - ProductId:', req.params.productId);
    console.log('🗑️ Cart: User ID:', req.user.id);
    console.log('🗑️ Cart: User Role:', req.user.role);
    
    // Check if admin is trying to delete with a target user ID
    const targetUserId = req.query.userId || req.user.id;
    console.log('🗑️ Cart: Target User ID:', targetUserId);
    
    // Allow admins to delete from any cart, users only from their own
    if (req.user.role !== 'admin' && targetUserId !== req.user.id) {
      console.log('🗑️ Cart: Permission denied - user trying to delete from another cart');
      return res.status(403).json({ message: 'Permission denied' });
    }

    const cart = await Cart.findOne({ userId: targetUserId });

    if (!cart) {
      console.log('🗑️ Cart: Cart not found for user:', targetUserId);
      return res.status(404).json({ message: 'Cart not found' });
    }

    const originalLength = cart.items.length;
    console.log('🗑️ Cart: Items before filter:', originalLength);
    console.log('🗑️ Cart: Current cart items:', cart.items.map(item => ({
      productId: item.productId,
      productIdType: typeof item.productId,
      productIdString: item.productId.toString()
    })));
    
    // More robust comparison - handle both string and ObjectId
    cart.items = cart.items.filter(item => {
      const itemProductIdStr = item.productId.toString();
      const requestProductIdStr = req.params.productId.toString();
      const shouldKeep = itemProductIdStr !== requestProductIdStr;
      
      console.log('🗑️ Cart: Comparing', {
        itemProductId: itemProductIdStr,
        requestProductId: requestProductIdStr,
        shouldKeep: shouldKeep
      });
      
      return shouldKeep;
    });

    const newLength = cart.items.length;
    console.log('🗑️ Cart: Items after filter:', newLength);
    console.log('🗑️ Cart: Item removed:', originalLength !== newLength);

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('userId', 'email fullName')
      .populate('items.productId', 'name price imageUrl stock');
    
    console.log('🗑️ Cart: Returning updated cart');
    res.json(populatedCart);
  } catch (error) {
    console.error('🗑️ Cart: Remove error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ================= CLEAR CART =================
router.delete('/clear', Protect, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= ADMIN CART MANAGEMENT =================

// Get all user carts (admin only)
router.get('/admin/all', Protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const carts = await Cart.find()
      .populate('userId', 'email fullName')
      .populate('items.productId', 'name price imageUrl stock');

    res.json(carts);
  } catch (error) {
    console.error('🛒 Admin: Get all carts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific user cart (admin only)
router.get('/admin/user/:userId', Protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const cart = await Cart.findOne({ userId: req.params.userId })
      .populate('userId', 'email fullName')
      .populate('items.productId', 'name price imageUrl stock');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.json(cart);
  } catch (error) {
    console.error('🛒 Admin: Get user cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from any user's cart (admin only)
router.delete('/admin/user/:userId/remove/:productId', Protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    console.log('🛒 Admin: Removing item from user cart');
    console.log('🛒 Admin: Target User ID:', req.params.userId);
    console.log('🛒 Admin: Product ID:', req.params.productId);
    console.log('🛒 Admin: Admin User ID:', req.user.id);

    const cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      console.log('🛒 Admin: Cart not found for user:', req.params.userId);
      return res.status(404).json({ message: 'Cart not found' });
    }

    const originalLength = cart.items.length;
    console.log('🛒 Admin: Items before removal:', originalLength);

    cart.items = cart.items.filter(item => {
      const itemProductIdStr = item.productId.toString();
      const requestProductIdStr = req.params.productId.toString();
      const shouldKeep = itemProductIdStr !== requestProductIdStr;
      
      console.log('🛒 Admin: Comparing', {
        itemProductId: itemProductIdStr,
        requestProductId: requestProductIdStr,
        shouldKeep: shouldKeep
      });
      
      return shouldKeep;
    });

    const newLength = cart.items.length;
    console.log('🛒 Admin: Items after removal:', newLength);
    console.log('🛒 Admin: Item removed:', originalLength !== newLength);

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('userId', 'email fullName')
      .populate('items.productId', 'name price imageUrl stock');

    console.log('🛒 Admin: Cart updated successfully');
    res.json(populatedCart);
  } catch (error) {
    console.error('🛒 Admin: Remove item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear any user's cart (admin only)
router.delete('/admin/user/:userId/clear', Protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    console.log('🛒 Admin: Clearing user cart:', req.params.userId);

    const cart = await Cart.findOneAndDelete({ userId: req.params.userId });

    if (!cart) {
      console.log('🛒 Admin: No cart found to clear');
      return res.status(404).json({ message: 'Cart not found' });
    }

    console.log('🛒 Admin: Cart cleared successfully');
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('🛒 Admin: Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
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
    
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      console.log(' Cart: Cart not found');
      return res.status(404).json({ message: 'Cart not found' });
    }

    const originalLength = cart.items.length;
    console.log(' Cart: Items before filter:', originalLength);
    console.log(' Cart: Current cart items:', cart.items.map(item => ({
      productId: item.productId,
      productIdType: typeof item.productId,
      productIdString: item.productId.toString()
    })));
    
    // More robust comparison - handle both string and ObjectId
    cart.items = cart.items.filter(item => {
      const itemProductIdStr = item.productId.toString();
      const requestProductIdStr = req.params.productId.toString();
      const shouldKeep = itemProductIdStr !== requestProductIdStr;
      
      console.log(' Cart: Comparing', {
        itemProductId: itemProductIdStr,
        requestProductId: requestProductIdStr,
        shouldKeep: shouldKeep
      });
      
      return shouldKeep;
    });

    const newLength = cart.items.length;
    console.log(' Cart: Items after filter:', newLength);
    console.log(' Cart: Item removed:', originalLength !== newLength);

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.productId', 'name price imageUrl stock');
    console.log(' Cart: Returning updated cart');
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

export default router;
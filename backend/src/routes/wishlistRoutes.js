import express from 'express';
import Wishlist from '../models/wishlist.js';
import User from '../models/user.js';
import { Protect } from '../middleware/auth.js';

const router = express.Router();

// Get user wishlist
router.get('/', Protect, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id, products: [] });
    }
    
    res.json(wishlist.products || []);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching wishlist' });
  }
});

// Add to wishlist
router.post('/add', Protect, async (req, res) => {
  try {
    const { productId } = req.body;
    
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id, products: [Number(productId)] });
    } else {
      if (!wishlist.products.includes(Number(productId))) {
        wishlist.products.push(Number(productId));
        await wishlist.save();
      }
    }
    
    wishlist = await Wishlist.findOne({ userId: req.user.id });
    res.json(wishlist.products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error adding to wishlist' });
  }
});

// Remove from wishlist
router.delete('/remove/:productId', Protect, async (req, res) => {
  try {
    const { productId } = req.params;
    
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId
      );
      await wishlist.save();
    }
    
    wishlist = await Wishlist.findOne({ userId: req.user.id });
    res.json(wishlist.products || []);
  } catch (error) {
    res.status(500).json({ message: 'Server Error removing from wishlist' });
  }
});

export default router;

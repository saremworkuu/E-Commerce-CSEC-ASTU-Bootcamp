import express from 'express';
import Wishlist from '../models/wishlist.js';
import User from '../models/user.js';
import { Protect } from '../middleware/auth.js';

const router = express.Router();

// Get user wishlist
router.get('/', Protect, async (req, res) => {
  try {
    console.log('❤️ Backend: Fetching wishlist for user:', req.user.id);
    
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    
    if (!wishlist) {
      console.log('❤️ Backend: No wishlist found, creating empty one');
      wishlist = await Wishlist.create({ userId: req.user.id, products: [] });
    }
    
    console.log('❤️ Backend: Found wishlist products:', wishlist.products);
    res.json(wishlist.products || []);
  } catch (error) {
    console.error('❤️ Backend: Fetch error:', error);
    res.status(500).json({ message: 'Server Error fetching wishlist' });
  }
});

// Add to wishlist
router.post('/add', Protect, async (req, res) => {
  try {
    const { productId } = req.body;
    
    console.log('❤️ Backend: Adding to wishlist');
    console.log('❤️ Backend: User ID:', req.user.id);
    console.log('❤️ Backend: Product ID:', productId);
    console.log('❤️ Backend: Product ID type:', typeof productId);
    
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    
    if (!wishlist) {
      console.log('❤️ Backend: Creating new wishlist');
      wishlist = await Wishlist.create({ userId: req.user.id, products: [Number(productId)] });
    } else {
      console.log('❤️ Backend: Existing wishlist products:', wishlist.products);
      if (!wishlist.products.includes(Number(productId))) {
        console.log('❤️ Backend: Adding product to wishlist');
        wishlist.products.push(Number(productId));
        await wishlist.save();
      } else {
        console.log('❤️ Backend: Product already in wishlist');
      }
    }
    
    wishlist = await Wishlist.findOne({ userId: req.user.id });
    console.log('❤️ Backend: Updated wishlist:', wishlist.products);
    res.json(wishlist.products);
  } catch (error) {
    console.error('❤️ Backend: Add error:', error);
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

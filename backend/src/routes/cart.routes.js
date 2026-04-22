const express = require('express');
const router = express.Router();
// Importing the service logic
const cartService = require('../services/cartServices');

// GET user cart
// URL: http://localhost:5000/api/cart/:userId
router.get('/:userId', async (req, res) => {
    try {
        const cart = await cartService.getCartByUserId(req.params.userId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ADD item to cart
// URL: http://localhost:5000/api/cart/add
router.post('/add', async (req, res) => {
    const { userId, productId, quantity, price } = req.body;
    try {
        // Ensure this function name matches exactly what is in cartServices.js
        const updatedCart = await cartService.addToCart(userId, { productId, quantity, price });
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// REMOVE item from cart
// URL: http://localhost:5000/api/cart/remove
router.delete('/remove', async (req, res) => {
    const { userId, productId } = req.body;
    try {
        const updatedCart = await cartService.removeFromCart(userId, productId);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

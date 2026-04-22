const { Cart } = require('../models'); // Pulls from your models/index.js

/**
 * Get or create a cart for a user
 */
const getCartByUserId = async (userId) => {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = await Cart.create({ userId, items: [] });
    }
    return cart;
};

/**
 * Add an item to the cart or update its quantity
 */
const addToCart = async (userId, { productId, quantity, price }) => {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
        // If no cart exists, create one with the item
        return await Cart.create({
            userId,
            items: [{ productId, quantity, price }]
        });
    }

    // Check if product already exists in the cart
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
        // Update quantity if item exists
        cart.items[itemIndex].quantity += quantity;
    } else {
        // Add new item if it doesn't exist
        cart.items.push({ productId, quantity, price });
    }

    return await cart.save();
};

/**
 * Remove an item from the cart
 */
const removeFromCart = async (userId, productId) => {
    const cart = await Cart.findOne({ userId });
    if (!cart) return null;

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    return await cart.save();
};

module.exports = {
    getCartByUserId,
    addToCart,
    removeFromCart
};


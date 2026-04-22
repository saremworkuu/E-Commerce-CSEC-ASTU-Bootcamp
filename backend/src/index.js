const express = require('express');
const mongoose = require('mongoose');

// Import your cart routes
const cartRoutes = require('./routes/cart.routes');

const app = express();
const PORT = 5000;

// Middleware to parse JSON data from requests
app.use(express.json());

// --- ROUTES ---
// This connects your cart routes to http://localhost:5000/api/cart
app.use('/api/cart', cartRoutes);

// Simple Health Check Route
app.get('/', (req, res) => {
    res.send('E-Commerce Server is running!');
});

// --- DATABASE CONNECTION ---
// Using 127.0.0.1 instead of localhost avoids some common Windows connection errors
mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
    .then(() => {
        console.log('Connected to MongoDB');
        // --- START SERVER ---
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error.message);
    });

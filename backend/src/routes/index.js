const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware: MUST be before routes to read your Thunder Client data
app.use(express.json());

// Import your cart routes
// Path is './routes/cart.routes' because index.js and the routes folder are siblings
const cartRoutes = require('./cart.routes');

// Mount the routes
// This makes your URL: http://localhost:5000/api/cart/add
app.use('/api/cart', cartRoutes); 

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
    .then(() => {
        console.log('Connected to MongoDB');
        // Start server only AFTER database connects
        app.listen(5000, () => {
            console.log(`Server is running on http://localhost:5000`);
        });
    })
    .catch(err => console.error("Database connection error:", err));


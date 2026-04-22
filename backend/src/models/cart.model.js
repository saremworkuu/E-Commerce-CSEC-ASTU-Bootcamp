const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    items: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product', // Links to a Product model if you have one
                required: true 
            },
            quantity: { 
                type: Number, 
                required: true, 
                default: 1 
            },
            price: { 
                type: Number, 
                required: true 
            }
        }
    ]
}, { 
    timestamps: true // Automatically creates 'createdAt' and 'updatedAt' fields
});

module.exports = mongoose.model('Cart', cartSchema);

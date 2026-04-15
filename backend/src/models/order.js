// models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  items: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: false 
    },
    quantity: { 
      type: Number, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    }
  }],

  totalPrice: { 
    type: Number, 
    required: true 
  },

  // New Shipping Information
  shippingInfo: {
    fullName: { 
      type: String, 
      required: true 
    },
    phone: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true 
    },
    address: { 
      type: String, 
      required: true 
    },
    country: { 
      type: String, 
      required: true 
    }
  },

  // Payment Info (We store only for record - never store full card details in production!)
  paymentInfo: {
    cardType: { 
      type: String, 
      enum: ['visa', 'mastercard', 'amex'], 
      required: true 
    },
    cardHolder: { 
      type: String, 
      required: true 
    },
    // We do NOT store full card number or CVV in real apps (for security)
    lastFourDigits: { 
      type: String 
    },
  },

  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;

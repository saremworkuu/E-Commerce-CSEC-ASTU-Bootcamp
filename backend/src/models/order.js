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
      type: String, 
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
      required: false 
    },
    phone: { 
      type: String, 
      required: false 
    },
    email: { 
      type: String, 
      required: false 
    },
    address: { 
      type: String, 
      required: false 
    },
    country: { 
      type: String, 
      required: false 
    }
  },

  // Payment Info (We store only for record - never store full card details in production!)
  paymentInfo: {
    cardType: { 
      type: String, 
      enum: ['visa', 'mastercard', 'amex', 'chapa'], 
      required: false 
    },
    cardHolder: { 
      type: String, 
      required: false 
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

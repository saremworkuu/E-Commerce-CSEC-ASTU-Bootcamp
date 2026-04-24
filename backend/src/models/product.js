// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  category: { 
    type: String, 
    required: true, 
    trim: true 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  description: { 
    type: String, 
    required: true 
  },
  shortDescription: {   // Added for better embedding context
    type: String,
    trim: true
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  stock: { 
    type: Number, 
    required: true, 
    default: 10,
    min: 0 
  },
  featured: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true 
});

// Optional: Text index for fallback keyword search
productSchema.index({ name: 'text', description: 'text', category: 'text' });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
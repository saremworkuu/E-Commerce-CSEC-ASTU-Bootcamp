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

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
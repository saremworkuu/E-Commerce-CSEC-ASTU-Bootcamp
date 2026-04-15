import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/product.js';

dotenv.config();

const productsToSeed = [
  {
    name: "Premium Wireless Headphones",
    price: 299.99,
    description: "Experience studio-quality sound with our premium wireless headphones. Featuring active noise cancellation and 40-hour battery life.",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    featured: true,
    stock: 50
  },
  {
    name: "Minimalist Leather Watch",
    price: 149.00,
    description: "A timeless piece for the modern individual. Genuine Italian leather strap and scratch-resistant sapphire crystal.",
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    featured: true,
    stock: 30
  },
  {
    name: "Smart Home Speaker",
    price: 89.99,
    description: "Control your entire home with your voice. Crystal clear audio and seamless integration with all your smart devices.",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1589492477829-5be5d0b19d58?auto=format&fit=crop&w=800&q=80",
    stock: 40
  },
  {
    name: "Ergonomic Office Chair",
    price: 399.00,
    description: "Work in comfort with our fully adjustable ergonomic chair. Breathable mesh back and lumbar support for long hours.",
    category: "Furniture",
    imageUrl: "https://images.unsplash.com/photo-1505843490701-5be5d0b19d58?auto=format&fit=crop&w=800&q=80",
    featured: true,
    stock: 15
  },
  {
    name: "Professional Camera Lens",
    price: 899.00,
    description: "Capture every detail with our high-performance 50mm f/1.2 lens. Perfect for portraits and low-light photography.",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    stock: 8
  },
  {
    name: "Canvas Travel Backpack",
    price: 75.00,
    description: "Durable canvas backpack with multiple compartments and a padded laptop sleeve. Ideal for daily commutes and weekend trips.",
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    stock: 25
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Optional: Clear existing products first (uncomment if you want fresh seed)
    // await Product.deleteMany({});
    // console.log('Cleared existing products');

    const inserted = await Product.insertMany(productsToSeed);
    console.log(`✅ Successfully seeded ${inserted.length} products!`);
    console.log('Product IDs:', inserted.map(p => p._id));

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedDatabase();
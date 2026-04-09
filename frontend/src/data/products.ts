export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  category: string;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    description: "Experience studio-quality sound with our premium wireless headphones. Featuring active noise cancellation and 40-hour battery life.",
    category: "Electronics",
    featured: true
  },
  {
    id: 2,
    name: "Minimalist Leather Watch",
    price: 149.00,
    originalPrice: 199.00,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    description: "A timeless piece for the modern individual. Genuine Italian leather strap and scratch-resistant sapphire crystal.",
    category: "Accessories",
    featured: true
  },
  {
    id: 3,
    name: "Smart Home Speaker",
    price: 89.99,
    originalPrice: 120.00,
    image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=800&q=80",
    description: "Control your entire home with your voice. Crystal clear audio and seamless integration with all your smart devices.",
    category: "Electronics"
  },
  {
    id: 4,
    name: "Ergonomic Office Chair",
    price: 399.00,
    image: "https://images.unsplash.com/photo-1505843490701-5be5d0b19d58?auto=format&fit=crop&w=800&q=80",
    description: "Work in comfort with our fully adjustable ergonomic chair. Breathable mesh back and lumbar support for long hours.",
    category: "Furniture",
    featured: true
  },
  {
    id: 5,
    name: "Professional Camera Lens",
    price: 899.00,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    description: "Capture every detail with our high-performance 50mm f/1.2 lens. Perfect for portraits and low-light photography.",
    category: "Electronics"
  },
  {
    id: 6,
    name: "Canvas Travel Backpack",
    price: 75.00,
    originalPrice: 100.00,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    description: "Durable canvas backpack with multiple compartments and a padded laptop sleeve. Ideal for daily commutes and weekend trips.",
    category: "Accessories"
  }
];

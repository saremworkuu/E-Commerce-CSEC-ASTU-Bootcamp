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
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    description: "Experience studio-quality sound with our premium wireless headphones. Featuring active noise cancellation and 40-hour battery life.",
    category: "Electronics",
    featured: true
  },
  {
    id: 2,
    name: "Urban Streetwear Set",
    price: 149.00,
    originalPrice: 199.00,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    description: "Premium cotton streetwear set designed for comfort and style. Perfect for the modern urban explorer.",
    category: "Apparel",
    featured: true
  },
  {
    id: 3,
    name: "Classic Canvas Sneakers",
    price: 89.99,
    originalPrice: 120.00,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
    description: "Timeless canvas sneakers that go with everything. Durable construction and comfortable cushioning for all-day wear.",
    category: "Footwear"
  },
  {
    id: 4,
    name: "Performance Running Shoes",
    price: 399.00,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    description: "Engineered for speed and comfort. Features advanced responsive cushioning and a breathable mesh upper for peak performance.",
    category: "Footwear",
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
  },
  {
    id: 7,
    name: "Modern Velvet Sofa",
    price: 899.00,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    description: "Add a touch of luxury to your living room with our deep green velvet sofa. Features solid oak legs and high-density foam cushions.",
    category: "Furniture"
  }
];

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { products as staticProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import { ChevronDown, Search } from 'lucide-react';

interface Product {
  id: number | string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  featured?: boolean;
}

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [sortBy, setSortBy] = useState('newest');

  const [backendProducts, setBackendProducts] = useState<Product[]>([]);

  const activeCategory = searchParams.get('category') || 'All';

  // ================= FETCH BACKEND PRODUCTS =================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');

        const formatted = res.data.map((p: any) => ({
          id: p._id, // string id
          name: p.name,
          price: p.price,
          image: p.imageUrl,
          description: p.description,
          category: p.category,
          featured: p.featured || false
        }));

        setBackendProducts(formatted);

      } catch (err) {
        console.error('Failed to fetch backend products:', err);
      }
    };

    fetchProducts();
  }, []);

  // ================= MERGE STATIC + BACKEND =================
  const allProducts: Product[] = [
    ...staticProducts,     // your bootcamp products
    ...backendProducts     // real DB products
  ];

  // ================= SYNC SEARCH =================
  useEffect(() => {
    setSearchQuery(urlSearch);
  }, [urlSearch]);

  const categories = ['All', ...new Set(allProducts.map(p => p.category))];

  const filteredProducts = useMemo(() => {
    let result = allProducts;

    // CATEGORY FILTER
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    // SEARCH FILTER
    if (searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // SORT
    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [allProducts, activeCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Shop All Products
        </h1>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col lg:flex-row justify-between mb-12 gap-6">

        {/* CATEGORY */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}
              className={`px-6 py-2 rounded-full text-sm ${
                activeCategory === cat
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SEARCH + SORT */}
        <div className="flex gap-4">

          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-full"
            />
          </div>

          {/* SORT */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-full"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Low → High</option>
            <option value="price-high">High → Low</option>
          </select>
        </div>
      </div>

      {/* PRODUCTS */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          No products found
        </div>
      )}
    </div>
  );
};

export default Shop;
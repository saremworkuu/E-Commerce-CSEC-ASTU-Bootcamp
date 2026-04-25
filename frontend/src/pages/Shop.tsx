import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ChevronDown, Search } from 'lucide-react';
import { apiUrl } from '../lib/apiService';
import { products as initialProducts } from '../data/products';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(apiUrl('/products'));
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch home products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const activeCategory = searchParams.get('category') || 'All';

  // Update local search query when URL changes
  useEffect(() => {
    setSearchQuery(urlSearch);
  }, [urlSearch]);

  const categories = ['All', ...new Set(products.map((p: any) => p.category))];

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory !== 'All') {
      result = result.filter(
        (p) => (p.category || '').trim().toLowerCase() === activeCategory.trim().toLowerCase()
      );
    }

    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">Shop All Products</h1>
        <p className="text-gray-500 dark:text-gray-400">Discover our full range of premium products.</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center space-y-4 md:space-y-0 mb-12 gap-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 grow max-w-4xl">
          {/* Categories Dropdown */}
          <div className="relative w-full sm:w-64">
            <select 
              value={activeCategory}
              onChange={(e) => setSearchParams(e.target.value === 'All' ? {} : { category: e.target.value })}
              className="w-full appearance-none pl-6 pr-12 py-3.5 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl focus:outline-none focus:border-black dark:focus:border-white transition-colors text-sm font-medium cursor-pointer dark:text-white"
            >
              <option disabled>Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>

          {/* Search */}
          <div className="relative w-full grow">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (val) {
                  setSearchParams(prev => {
                    const newParams = new URLSearchParams(prev);
                    newParams.set('search', val);
                    return newParams;
                  });
                } else {
                  setSearchParams(prev => {
                    const newParams = new URLSearchParams(prev);
                    newParams.delete('search');
                    return newParams;
                  });
                }
              }}
              className="w-full pl-14 pr-6 py-3.5 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl focus:outline-none focus:border-black dark:focus:border-white transition-colors text-sm dark:text-white"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="relative w-full md:w-auto">
          <select 
            value={sortBy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
            className="w-full md:w-auto appearance-none pl-6 pr-12 py-3.5 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl focus:outline-none focus:border-black dark:focus:border-white transition-colors text-sm font-medium cursor-pointer dark:text-white"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[4/5] bg-gray-100 dark:bg-neutral-800 rounded-3xl animate-pulse" />
              <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded w-2/3 animate-pulse" />
              <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded w-1/2 animate-pulse" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id || (product as any)._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-gray-50 dark:bg-neutral-900/50 rounded-3xl">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No products found matching your criteria.</p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSearchParams({});
            }}
            className="mt-4 text-black dark:text-white font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Shop;

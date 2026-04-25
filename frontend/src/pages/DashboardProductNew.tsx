import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import axios from 'axios';
import { apiUrl } from '../lib/apiService';
import ImageUpload from '../components/ImageUpload';

const DashboardProductNew: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: '',
    stock: '10',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Basic validation
    if (!formData.name || !formData.price || !formData.category || !formData.description) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Your JWT token from login

      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        imageUrl: formData.image.trim() || 'https://via.placeholder.com/400x300?text=No+Image', // fallback
        stock: parseInt(formData.stock) || 10,
      };

      const response = await axios.post(
        apiUrl('/products'),
        productData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Product created:', response.data);

      setSuccess(true);

      // Reset form
      setFormData({
        name: '',
        category: '',
        price: '',
        description: '',
        image: '',
        stock: '10',
      });

      // Optional: redirect after short delay
      setTimeout(() => {
        navigate('/dashboard/products');
      }, 1500);

    } catch (err: any) {
      console.error('Error creating product:', err.response?.data || err.message);
      
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-gray-100 dark:border-neutral-800 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight dark:text-white">Add New Product</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fill in the details below to create a product listing.</p>
          </div>
          <button onClick={() => navigate('/dashboard/products')} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-6 py-4 rounded-2xl text-sm font-medium">
              ✅ Product created successfully!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1" htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Leather Bag"
                className="rounded-xl bg-gray-50/50 dark:bg-neutral-800/50 border-gray-100 dark:border-neutral-800 h-12"
                required
              />
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1" htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={handleSelectChange}>
                <SelectTrigger className="rounded-xl bg-gray-50/50 dark:bg-neutral-800/50 border-gray-100 dark:border-neutral-800 h-12">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Apparel">Apparel</SelectItem>
                  <SelectItem value="Jewelry">Jewelry</SelectItem>
                  <SelectItem value="Home Goods">Home Goods</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Footwear">Footwear</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1" htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="rounded-xl bg-gray-50/50 dark:bg-neutral-800/50 border-gray-100 dark:border-neutral-800 h-12"
                required
              />
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1" htmlFor="stock">Initial Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                placeholder="10"
                className="rounded-xl bg-gray-50/50 dark:bg-neutral-800/50 border-gray-100 dark:border-neutral-800 h-12"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-2.5">
              <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1" htmlFor="image">Product Image</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Enter Image URL (https://...)"
                className="rounded-xl bg-gray-50/50 dark:bg-neutral-800/50 border-gray-100 dark:border-neutral-800 h-12"
              />
            </div>
            
            <ImageUpload 
              variant="large"
              onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image: url }))} 
            />
          </div>

          <div className="space-y-2.5 pt-2">
            <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1" htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the product..."
              className="min-h-32 rounded-xl bg-gray-50/50 dark:bg-neutral-800/50 border-gray-100 dark:border-neutral-800 p-4 resize-none"
              required
            />
          </div>

          <div className="pt-6">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full py-7 bg-black text-white dark:bg-white dark:text-black font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl h-auto uppercase tracking-widest text-sm"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardProductNew;

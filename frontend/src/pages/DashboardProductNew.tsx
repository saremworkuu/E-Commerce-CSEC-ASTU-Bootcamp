import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import axios from 'axios';
import { apiUrl } from '../lib/api';

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
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">Add New Product</h1>
          <p className="text-gray-500 dark:text-gray-400">Create a new product for your store.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-6 shadow-sm">

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-400 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm">
            ✅ Product created successfully!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Premium Wireless Headphones"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
            <Select value={formData.category} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
                <SelectItem value="Furniture">Furniture</SelectItem>
                <SelectItem value="Apparel">Apparel</SelectItem>
                <SelectItem value="Jewelry">Jewelry</SelectItem>
                <SelectItem value="Home Goods">Home Goods</SelectItem>
                <SelectItem value="Clothing">Clothing</SelectItem>
                <SelectItem value="Clothing">Footwear</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price">Price ($) <span className="text-red-500">*</span></Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="29.99"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Initial Stock</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              placeholder="10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the product features, specifications, etc..."
            className="min-h-[140px]"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/dashboard/products')}
            disabled={loading}
          >
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-black text-white dark:bg-white dark:text-black min-w-[140px]"
          >
            {loading ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DashboardProductNew;
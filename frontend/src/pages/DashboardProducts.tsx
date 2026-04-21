import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  Table,  
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../components/ui/dropdown-menu';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const DashboardProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: '',
    stock: '10'
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProducts(products.filter(p => (p._id || p.id) !== id));
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    // Normalize body to match backend expectations (imageUrl, stock)
    if (!formData.name || !formData.category || !formData.price || !formData.description) {
      alert("Please fill in all required fields (Name, Category, Price, Description).");
      return;
    }

    const payload = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      description: formData.description,
      imageUrl: formData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      stock: parseInt(formData.stock) || 10,
      featured: false
    };

    try {
      if (editingProduct) {
        const id = editingProduct._id || editingProduct.id;
        const res = await axios.put(`http://localhost:5000/api/products/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(products.map(p => (p._id || p.id) === id ? res.data.product : p));
      } else {
        const res = await axios.post('http://localhost:5000/api/products', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts([res.data.product, ...products]);
      }
      
      setShowForm(false);
      setEditingProduct(null);
      setFormData({ name: '', category: '', price: '', description: '', image: '', stock: '10' });
    } catch (err: any) {
      console.error('Save failed', err.response?.data || err);
      alert(`Save failed: ${err.response?.data?.message || err.message}`);
      return; // prevent clearing the form so user can fix the issue
    }
  };

  const openEditDialog = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category || '',
      price: product.price?.toString() || '0',
      description: product.description || '',
      image: product.imageUrl || product.image || '',
      stock: product.stock?.toString() || '10'
    });
    setShowForm(true);
  };

  const toggleForm = () => {
    if (showForm) {
      setShowForm(false);
      setEditingProduct(null);
      setFormData({ name: '', category: '', price: '', description: '', image: '', stock: '10' });
    } else {
      setShowForm(true);
      setEditingProduct(null);
      setFormData({ name: '', category: '', price: '', description: '', image: '', stock: '10' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Product Management</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">Manage your inventory and product listings.</p>
        </div>
        
        <Button onClick={toggleForm} className="bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-black rounded-full px-6 font-medium shadow-sm">
          <Plus size={16} className="mr-2 stroke-[3]" />
          {showForm ? 'Close Form' : 'Add Product'}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="mb-6">
            <h2 className="text-xl font-bold dark:text-white">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fill in the details below to {editingProduct ? 'update' : 'create'} a product listing.
            </p>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Leather Bag" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={v => setFormData({...formData, category: v || ''})}
                >
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
                    <SelectItem value="Footwear">Footwear</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  step="0.01"
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Initial Stock</Label>
                <Input 
                  id="stock" 
                  type="number" 
                  value={formData.stock} 
                  onChange={e => setFormData({...formData, stock: e.target.value})}
                  placeholder="0" 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input 
                id="image" 
                value={formData.image} 
                onChange={e => setFormData({...formData, image: e.target.value})}
                placeholder="https://..." 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the product..." 
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={toggleForm}>
                Cancel
              </Button>
              <Button type="submit" className="bg-black text-white dark:bg-white dark:text-black">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search products..." 
            className="pl-11 h-10 rounded-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-10 rounded-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-gray-300 shadow-sm px-6">
          <Filter size={16} className="mr-2" />
          Filters
        </Button>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm overflow-hidden border border-gray-200 dark:border-neutral-800">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-gray-200 dark:border-neutral-800 text-gray-500">
              <TableHead className="w-[80px] font-medium font-sans">Image</TableHead>
              <TableHead className="font-medium font-sans">Product</TableHead>
              <TableHead className="font-medium font-sans">Category</TableHead>
              <TableHead className="font-medium font-sans">Price</TableHead>
              <TableHead className="font-medium font-sans">Stock</TableHead>
              <TableHead className="text-right font-medium font-sans">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product: any) => (
              <TableRow key={product._id || product.id} className="border-gray-100 dark:border-neutral-800">
                <TableCell>
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-800">
                    <img 
                      src={product.imageUrl || product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-bold text-gray-900 dark:text-white">{product.name}</TableCell>
                <TableCell>
                  <Badge className="bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 border-none px-3 py-1 font-normal w-fit rounded-full shadow-none">
                    {product.category || 'Uncategorized'}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-300">
                  ${Number(product.price).toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-600 dark:text-gray-300">{product.stock != null ? product.stock : 12}</span>
                    <Badge className="bg-[#e6f4ea] text-[#1e8e3e] dark:bg-green-900/30 dark:text-green-400 border-none px-2.5 py-0.5 text-xs font-medium rounded-full shadow-none">
                      In Stock
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer text-gray-700 hover:text-black hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white rounded-full">
                        <MoreHorizontal size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="dark:bg-neutral-900 shadow-xl border border-gray-200 dark:border-neutral-800">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => openEditDialog(product)}>
                        <Edit size={14} className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="dark:bg-neutral-800" />
                      <DropdownMenuItem 
                        className="text-red-500 focus:text-red-500"
                        onClick={() => handleDelete(product._id || product.id)}
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DashboardProducts;

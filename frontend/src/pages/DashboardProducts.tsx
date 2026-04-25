import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Filter,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  ChevronLeft,
  ChevronRight
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
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { apiUrl } from '../lib/apiService';
import { toast } from 'react-toastify';


const DashboardProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [featuredFilter, setFeaturedFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 10;

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
      const res = await axios.get(apiUrl('/products'));
      setProducts(res.data);
      setTotalPages(Math.ceil(res.data.length / itemsPerPage));
      setCurrentPage(1);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setUploading(true);
    try {
      const res = await axios.post(apiUrl('/upload'), data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, image: res.data.url }));
      toast.success('Image uploaded successfully');
    } catch (err: any) {
      console.error('Upload failed', err);
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    
    // Featured filter
    const matchesFeatured = featuredFilter === 'all' || 
                           (featuredFilter === 'featured' && p.featured) ||
                           (featuredFilter === 'not-featured' && !p.featured);
    
    return matchesSearch && matchesCategory && matchesFeatured;
  });

  // Paginated products
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(apiUrl(`/products/${id}`), {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProducts(products.filter(p => (p._id || p.id) !== id));
        toast.success('Product deleted successfully');
      } catch (err) {
        console.error('Delete failed:', err);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!formData.name || !formData.category || !formData.price || !formData.description) {
      toast.warning("Please fill in all required fields.");
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
        const res = await axios.put(apiUrl(`/products/${id}`), payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(products.map(p => (p._id || p.id) === id ? res.data.product : p));
        toast.success('Product updated successfully');
      } else {
        const res = await axios.post(apiUrl('/products'), payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts([res.data.product, ...products]);
        toast.success('Product created successfully');
      }
      
      setShowForm(false);
      setEditingProduct(null);
      setFormData({ name: '', category: '', price: '', description: '', image: '', stock: '10' });
    } catch (err: any) {
      console.error('Save failed', err.response?.data || err);
      toast.error(`Save failed: ${err.response?.data?.message || err.message}`);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingProduct(null);
    setFormData({ name: '', category: '', price: '', description: '', image: '', stock: '10' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Product Management</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">Manage your inventory and product listings.</p>
        </div>
        
        <Button onClick={toggleForm} className="bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-black rounded-full px-6 font-medium shadow-sm">
          <Plus size={16} className="mr-2 stroke-3" />
          {showForm ? 'Close Form' : 'Add Product'}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-8 shadow-xl mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="mb-8">
            <h2 className="text-2xl font-bold dark:text-white">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Provide the details below to {editingProduct ? 'update' : 'create'} a product.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-gray-400">Product Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Leather Bag" 
                  className="bg-gray-50 dark:bg-neutral-800 border-none h-12 rounded-xl"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs font-bold uppercase tracking-widest text-gray-400">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={v => setFormData({...formData, category: v || ''})}
                >
                  <SelectTrigger className="bg-gray-50 dark:bg-neutral-800 border-none h-12 rounded-xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-neutral-900 border-neutral-800">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-xs font-bold uppercase tracking-widest text-gray-400">Price ($)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  step="0.01"
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00" 
                  className="bg-gray-50 dark:bg-neutral-800 border-none h-12 rounded-xl"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-xs font-bold uppercase tracking-widest text-gray-400">Initial Stock</Label>
                <Input 
                  id="stock" 
                  type="number" 
                  value={formData.stock} 
                  onChange={e => setFormData({...formData, stock: e.target.value})}
                  placeholder="0" 
                  className="bg-gray-50 dark:bg-neutral-800 border-none h-12 rounded-xl"
                  required 
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Product Image</Label>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="grow space-y-2">
                  <Input 
                    id="image" 
                    value={formData.image} 
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    placeholder="Enter image URL or upload from local..." 
                    className="bg-gray-50 dark:bg-neutral-800 border-none h-12 rounded-xl"
                  />
                </div>
                <div className="flex-none">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <Button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    variant="outline"
                    className="h-12 rounded-xl border-dashed border-2 hover:border-black dark:hover:border-white transition-all px-6"
                  >
                    {uploading ? (
                      <RotateCcw className="animate-spin mr-2" size={18} />
                    ) : (
                      <Upload className="mr-2" size={18} />
                    )}
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>
              </div>
              {formData.image && (
                <div className="mt-2 relative w-32 h-32 rounded-2xl overflow-hidden border border-gray-100 dark:border-neutral-800 shadow-inner group">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImageIcon className="text-white" size={24} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-gray-400">Description</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the product features..." 
                className="min-h-[120px] bg-gray-50 dark:bg-neutral-800 border-none rounded-xl p-4"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-50 dark:border-neutral-800">
              <Button type="button" variant="ghost" onClick={toggleForm} className="rounded-xl px-8 h-12">
                Cancel
              </Button>
              <Button type="submit" className="bg-black text-white dark:bg-white dark:text-black rounded-xl px-10 h-12 font-bold">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search products..." 
            className="pl-12 h-12 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm rounded-2xl h-12 px-4">
                <Filter size={18} className="mr-2" />
                Category: {categoryFilter === 'all' ? 'All' : categoryFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark:bg-neutral-900 shadow-2xl border border-gray-200 dark:border-neutral-800 min-w-[150px] rounded-xl p-2">
              <DropdownMenuItem onClick={() => setCategoryFilter('all')} className="rounded-lg px-3 py-2 cursor-pointer">
                All Categories
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('Electronics')} className="rounded-lg px-3 py-2 cursor-pointer">
                Electronics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('Accessories')} className="rounded-lg px-3 py-2 cursor-pointer">
                Accessories
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('Furniture')} className="rounded-lg px-3 py-2 cursor-pointer">
                Furniture
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('Apparel')} className="rounded-lg px-3 py-2 cursor-pointer">
                Apparel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('Jewelry')} className="rounded-lg px-3 py-2 cursor-pointer">
                Jewelry
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('Home Goods')} className="rounded-lg px-3 py-2 cursor-pointer">
                Home Goods
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('Clothing')} className="rounded-lg px-3 py-2 cursor-pointer">
                Clothing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('Footwear')} className="rounded-lg px-3 py-2 cursor-pointer">
                Footwear
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('Other')} className="rounded-lg px-3 py-2 cursor-pointer">
                Other
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm rounded-2xl h-12 px-4">
                <Filter size={18} className="mr-2" />
                Featured: {featuredFilter === 'all' ? 'All' : featuredFilter === 'featured' ? 'Featured' : 'Not Featured'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark:bg-neutral-900 shadow-2xl border border-gray-200 dark:border-neutral-800 min-w-[150px] rounded-xl p-2">
              <DropdownMenuItem onClick={() => setFeaturedFilter('all')} className="rounded-lg px-3 py-2 cursor-pointer">
                All Products
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFeaturedFilter('featured')} className="rounded-lg px-3 py-2 cursor-pointer">
                Featured Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFeaturedFilter('not-featured')} className="rounded-lg px-3 py-2 cursor-pointer">
                Not Featured
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm overflow-hidden border border-gray-100 dark:border-neutral-800">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-gray-100 dark:border-neutral-800 text-gray-500">
              <TableHead className="w-24 font-bold uppercase text-[10px] tracking-widest pl-8 py-5">Image</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest">Product</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest">Category</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest">Price</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest">Stock</TableHead>
              <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product: any) => (
              <TableRow key={product._id || product.id} className="border-gray-50 dark:border-neutral-800 hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                <TableCell className="pl-8">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-800">
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
                  <Badge className="bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 border-none px-3 py-1 font-medium rounded-full shadow-none">
                    {product.category || 'Uncategorized'}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-900 dark:text-white font-bold">
                  ${Number(product.price).toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">{product.stock != null ? product.stock : 12}</span>
                    <Badge className="bg-[#e6f4ea] text-[#1e8e3e] dark:bg-green-900/30 dark:text-green-400 border-none px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-none">
                      In Stock
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-8">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-10 w-10 p-0 cursor-pointer text-gray-400 hover:text-black dark:hover:text-white rounded-full">
                        <MoreHorizontal size={20} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="dark:bg-neutral-900 shadow-2xl border border-gray-200 dark:border-neutral-800 rounded-2xl p-2 min-w-[160px]">
                      <DropdownMenuLabel className="px-3 py-2 text-[10px] uppercase tracking-widest text-gray-400">Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => openEditDialog(product)} className="rounded-xl px-3 py-2 cursor-pointer">
                        <Edit size={16} className="mr-3" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="mx-2 my-2 dark:bg-neutral-800" />
                      <DropdownMenuItem 
                        className="text-red-500 focus:text-red-500 rounded-xl px-3 py-2 cursor-pointer"
                        onClick={() => handleDelete(product._id || product.id)}
                      >
                        <Trash2 size={16} className="mr-3" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            Previous
          </Button>
          
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
      </div>
    </div>
  );
};

export default DashboardProducts;

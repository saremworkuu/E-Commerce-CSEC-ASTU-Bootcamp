import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Filter
} from 'lucide-react';
import { products as initialProducts, Product } from '../data/products';
import { Link, useNavigate } from 'react-router-dom';
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

const DashboardProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleEdit = (product: Product) => {
    // Placeholder: navigate to the same add page with an id param in the future
    navigate('/dashboard/products/new');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">Product Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your inventory and product listings.</p>
        </div>
        <Link to="/dashboard/products/new">
          <Button className="bg-black text-white dark:bg-white dark:text-black rounded-full px-6">
            <Plus size={18} className="mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search products..." 
            className="pl-10 bg-white dark:bg-neutral-900 border-none shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="bg-white dark:bg-neutral-900 border-none shadow-sm">
          <Filter size={18} className="mr-2" />
          Filters
        </Button>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-neutral-800">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-gray-100 dark:border-neutral-800">
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="border-gray-100 dark:border-neutral-800">
                <TableCell>
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-bold dark:text-white">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 border-none">
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell className="dark:text-white">${product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="dark:text-white">12</span>
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-none">In Stock</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="dark:bg-neutral-900 border-none shadow-xl">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(product)}>
                        <Edit size={14} className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="dark:bg-neutral-800" />
                      <DropdownMenuItem 
                        className="text-red-500 focus:text-red-500"
                        onClick={() => handleDelete(product.id)}
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

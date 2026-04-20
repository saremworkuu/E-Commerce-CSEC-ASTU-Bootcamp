import React, { useState, useEffect } from 'react';
import {
  Search,
  MoreHorizontal,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';
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
import axios from 'axios';

interface OrderData {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
    email: string;
  };
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  items: Array<{
    productId: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
}

const DashboardOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/orders/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    const token = localStorage.getItem('token');
    
    await axios.put(
      `/api/orders/${orderId}/status`,   // ← Corrected
      { status: newStatus },
      { 
        headers: { 
          Authorization: `Bearer ${token}` 
        } 
      }
    );

    fetchOrders(); // Refresh the list
    
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.message || 'Failed to update status');
  }
};

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${o.userId.firstName} ${o.userId.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.userId.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: OrderData['status']) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-none"><CheckCircle size={12} className="mr-1" /> Delivered</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-none"><Truck size={12} className="mr-1" /> Shipped</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-none"><Clock size={12} className="mr-1" /> Processing</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-none"><Clock size={12} className="mr-1" /> Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-none">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Order Management</h1>
        <p className="text-gray-500 dark:text-gray-400">Track and manage customer orders.</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search orders..."
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
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order._id} className="border-gray-100 dark:border-neutral-800">
                  <TableCell className="font-mono text-sm dark:text-white">
                    #{order._id.slice(-8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-bold dark:text-white">
                        {order.userId.firstName} {order.userId.lastName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.userId.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="dark:text-white">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </TableCell>
                  <TableCell className="font-bold dark:text-white">
                    ${order.totalPrice.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="dark:bg-neutral-900 border-none shadow-xl">
                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order._id, 'pending')}>
                          <Clock size={14} className="mr-2" />
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order._id, 'processing')}>
                          <Clock size={14} className="mr-2" />
                          Mark as Processing
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order._id, 'shipped')}>
                          <Truck size={14} className="mr-2" />
                          Mark as Shipped
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order._id, 'delivered')}>
                          <CheckCircle size={14} className="mr-2" />
                          Mark as Delivered
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="dark:bg-neutral-800" />
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500"
                          onClick={() => updateOrderStatus(order._id, 'cancelled')}
                        >
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DashboardOrders;

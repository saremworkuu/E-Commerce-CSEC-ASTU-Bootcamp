import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import { apiUrl } from '../lib/apiService';
import { toast } from 'react-toastify';


interface OrderData {
  _id: string;
  userId: { fullName: string; email: string };
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingInfo?: { fullName: string; email: string };
}

const DashboardOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(apiUrl('/orders/admin'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => {
    const customerName = (o.shippingInfo?.fullName || o.userId?.fullName || '').toLowerCase();
    const orderId = (o._id || '').toLowerCase();
    const matchesSearch = orderId.includes(searchTerm.toLowerCase()) || customerName.includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    
    // Date filter
    const orderDate = new Date(o.createdAt);
    const today = new Date();
    let matchesDate = true;
    
    if (dateFilter === 'today') {
      matchesDate = orderDate.toDateString() === today.toDateString();
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = orderDate >= weekAgo;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesDate = orderDate >= monthAgo;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: OrderData['status']) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-none"><CheckCircle size={12} className="mr-1" /> Delivered</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-none"><Truck size={12} className="mr-1" /> Shipped</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-none"><Clock size={12} className="mr-1" /> Pending</Badge>;
      case 'processing':
        return <Badge className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-none"><Clock size={12} className="mr-1" /> Processing</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-none">Cancelled</Badge>;
      default:
        return <Badge className="capitalize">{status}</Badge>;
    }
  };

  const updateStatus = async (id: string, newStatus: OrderData['status']) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(apiUrl(`/orders/${id}/status`), 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Optimistically update the UI
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update order status.');
    }

  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Order Management</h1>
        <p className="text-gray-500 dark:text-gray-400">View and manage customer orders and tracking status.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search orders by ID or customer name..." 
            className="pl-10 bg-white dark:bg-neutral-900 border-none shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white dark:bg-neutral-900 border-none shadow-sm">
                <Filter size={18} className="mr-2" />
                Status: {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark:bg-neutral-900 shadow-2xl border border-gray-200 dark:border-neutral-800 min-w-[150px] rounded-xl p-2">
              <DropdownMenuItem onClick={() => setStatusFilter('all')} className="rounded-lg px-3 py-2 cursor-pointer">
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('pending')} className="rounded-lg px-3 py-2 cursor-pointer">
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('processing')} className="rounded-lg px-3 py-2 cursor-pointer">
                Processing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('shipped')} className="rounded-lg px-3 py-2 cursor-pointer">
                Shipped
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('delivered')} className="rounded-lg px-3 py-2 cursor-pointer">
                Delivered
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('cancelled')} className="rounded-lg px-3 py-2 cursor-pointer">
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white dark:bg-neutral-900 border-none shadow-sm">
                <Filter size={18} className="mr-2" />
                Date: {dateFilter === 'all' ? 'All' : dateFilter.charAt(0).toUpperCase() + dateFilter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark:bg-neutral-900 shadow-2xl border border-gray-200 dark:border-neutral-800 min-w-[150px] rounded-xl p-2">
              <DropdownMenuItem onClick={() => setDateFilter('all')} className="rounded-lg px-3 py-2 cursor-pointer">
                All Time
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter('today')} className="rounded-lg px-3 py-2 cursor-pointer">
                Today
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter('week')} className="rounded-lg px-3 py-2 cursor-pointer">
                This Week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter('month')} className="rounded-lg px-3 py-2 cursor-pointer">
                This Month
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-neutral-800">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-gray-100 dark:border-neutral-800">
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 dark:text-white">Loading orders...</TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-500">No orders found.</TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order._id} className="border-gray-100 dark:border-neutral-800">
                  <TableCell className="font-mono text-sm font-bold dark:text-white">
                    #{order._id.slice(-6).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-bold dark:text-white">
                        {order.shippingInfo?.fullName || order.userId?.fullName || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.shippingInfo?.email || order.userId?.email || 'N/A'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-bold dark:text-white">${order.totalPrice?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
                          <MoreHorizontal size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-xl">
                        <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye size={14} className="mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="dark:bg-neutral-800" />
                        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-gray-400">Update Status</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => updateStatus(order._id, 'pending')}>
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(order._id, 'shipped')}>
                          Mark as Shipped
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(order._id, 'delivered')}>
                          Mark as Delivered
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

import React, { useState } from 'react';
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

interface OrderData {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}

const DashboardOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([
    { id: '#ORD-7281', customer: 'John Doe', email: 'john@example.com', total: 258.00, status: 'Delivered', date: '2026-04-05' },
    { id: '#ORD-7282', customer: 'Jane Smith', email: 'jane@example.com', total: 129.50, status: 'Shipped', date: '2026-04-08' },
    { id: '#ORD-7283', customer: 'Bob Wilson', email: 'bob@example.com', total: 89.00, status: 'Pending', date: '2026-04-10' },
    { id: '#ORD-7284', customer: 'Alice Brown', email: 'alice@example.com', total: 450.00, status: 'Pending', date: '2026-04-11' },
    { id: '#ORD-7285', customer: 'Charlie Davis', email: 'charlie@example.com', total: 75.25, status: 'Cancelled', date: '2026-04-02' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: OrderData['status']) => {
    switch (status) {
      case 'Delivered':
        return <Badge className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-none"><CheckCircle size={12} className="mr-1" /> {status}</Badge>;
      case 'Shipped':
        return <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-none"><Truck size={12} className="mr-1" /> {status}</Badge>;
      case 'Pending':
        return <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-none"><Clock size={12} className="mr-1" /> {status}</Badge>;
      case 'Cancelled':
        return <Badge className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-none">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const updateStatus = (id: string, newStatus: OrderData['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Order Management</h1>
        <p className="text-gray-500 dark:text-gray-400">View and manage customer orders and tracking status.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search orders by ID or customer name..." 
            className="pl-10 bg-white dark:bg-neutral-900 border-none shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="bg-white dark:bg-neutral-900 border-none shadow-sm">
          <Filter size={18} className="mr-2" />
          Status
        </Button>
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
            {filteredOrders.map((order) => (
              <TableRow key={order.id} className="border-gray-100 dark:border-neutral-800">
                <TableCell className="font-mono text-sm font-bold dark:text-white">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-bold dark:text-white">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500 dark:text-gray-400">{order.date}</TableCell>
                <TableCell className="font-bold dark:text-white">${order.total.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="dark:bg-neutral-900 border-none shadow-xl">
                      <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye size={14} className="mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="dark:bg-neutral-800" />
                      <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-gray-400">Update Status</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => updateStatus(order.id, 'Pending')}>
                        Mark as Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(order.id, 'Shipped')}>
                        Mark as Shipped
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(order.id, 'Delivered')}>
                        Mark as Delivered
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

export default DashboardOrders;

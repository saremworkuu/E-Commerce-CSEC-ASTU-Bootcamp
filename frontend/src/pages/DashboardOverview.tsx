import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingBag, TrendingUp, ArrowUpRight, ArrowDownRight, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { motion } from 'motion/react';
import axios from 'axios';
import { apiUrl } from '../lib/apiService';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalMessages: number;
}



const DashboardOverview: React.FC = () => {
  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [statsRes, ordersRes, messagesRes] = await Promise.all([
          axios.get(apiUrl('/admin/stats'), { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(apiUrl('/orders/admin?limit=5'), { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(apiUrl('/admin/messages?limit=3'), { headers: { Authorization: `Bearer ${token}` } })
        ]);

        
        setStatsData(statsRes.data);
        setRecentOrders(ordersRes.data.slice(0, 5));
        setRecentMessages(messagesRes.data.slice(0, 3));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { 
      label: 'Total Users', 
      value: statsData?.totalUsers.toLocaleString() || '0', 
      icon: <Users className="text-blue-500" />, 
      change: '+4%', 
      isPositive: true 
    },
    { 
      label: 'Total Products', 
      value: statsData?.totalProducts.toString() || '0', 
      icon: <Package className="text-purple-500" />, 
      change: '+2', 
      isPositive: true 
    },
    { 
      label: 'Total Orders', 
      value: statsData?.totalOrders.toString() || '0', 
      icon: <ShoppingBag className="text-orange-500" />, 
      change: '+12%', 
      isPositive: true 
    },
    { 
      label: 'Revenue', 
      value: `$${statsData?.totalRevenue.toLocaleString() || '0.00'}`, 
      icon: <TrendingUp className="text-green-500" />, 
      change: '+8%', 
      isPositive: true 
    },
    { 
      label: 'Messages', 
      value: statsData?.totalMessages?.toString() || '0', 
      icon: <Mail className="text-blue-400" />, 
      change: statsData?.totalMessages ? 'New' : 'None', 
      isPositive: !!statsData?.totalMessages 
    },
  ];


  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px] dark:text-white">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back, here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm dark:bg-neutral-900">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  {stat.label}
                </CardTitle>
                <div className="p-2 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-white">{stat.value}</div>
                <div className="flex items-center mt-1">
                  {stat.isPositive ? (
                    <ArrowUpRight size={14} className="text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight size={14} className="text-red-500 mr-1" />
                  )}
                  <span className={`text-xs font-bold ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-center py-10 text-gray-500">No orders yet.</p>
              ) : (
                recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center text-xs font-bold uppercase">
                        {(order.userId?.fullName || 'U').charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold dark:text-white">{order.userId?.fullName || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold dark:text-white">${order.totalPrice.toFixed(2)}</p>
                      <p className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Store Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-gray-900 to-black dark:from-white dark:to-gray-200 rounded-[2rem] text-white dark:text-black">
                <p className="text-sm font-bold uppercase tracking-widest opacity-70 mb-2">Pending Actions</p>
                <h3 className="text-3xl font-bold mb-4">{statsData?.pendingOrders || 0} Orders</h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  You have {statsData?.pendingOrders || 0} orders waiting to be processed. Check the orders tab to manage them.
                </p>
              </div>
              
              <div className="p-6 bg-gray-50 dark:bg-neutral-800/50 rounded-[2rem]">
                <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Recent Messages</p>
                <div className="space-y-3 mt-4">
                  {recentMessages.length === 0 ? (
                    <p className="text-xs text-gray-400">No recent messages.</p>
                  ) : (
                    recentMessages.map(msg => (
                      <div key={msg._id} className="p-3 bg-white dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs font-bold dark:text-white truncate">{msg.firstName} {msg.lastName}</p>
                          <span className="text-[8px] text-gray-400 uppercase">{msg.status}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 line-clamp-1">{msg.message}</p>
                      </div>
                    ))
                  )}
                </div>
                <Button 
                  onClick={() => navigate('/dashboard/messages')} 
                  variant="ghost" 
                  className="w-full mt-4 text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white h-auto py-2"
                >
                  View All Messages
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default DashboardOverview;

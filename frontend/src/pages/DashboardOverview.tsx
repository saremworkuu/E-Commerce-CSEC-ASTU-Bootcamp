import React from 'react';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { motion } from 'motion/react';

const DashboardOverview: React.FC = () => {
  const stats = [
    { 
      label: 'Total Users', 
      value: '1,284', 
      icon: <Users className="text-blue-500" />, 
      change: '+12%', 
      isPositive: true 
    },
    { 
      label: 'Total Products', 
      value: '48', 
      icon: <Package className="text-purple-500" />, 
      change: '+4', 
      isPositive: true 
    },
    { 
      label: 'Total Orders', 
      value: '856', 
      icon: <ShoppingBag className="text-orange-500" />, 
      change: '+18%', 
      isPositive: true 
    },
    { 
      label: 'Revenue', 
      value: '$42,500', 
      icon: <TrendingUp className="text-green-500" />, 
      change: '-3%', 
      isPositive: false 
    },
  ];

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

      {/* Recent Activity / Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((order) => (
                <div key={order} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center text-xs font-bold">
                      JD
                    </div>
                    <div>
                      <p className="text-sm font-bold dark:text-white">John Doe</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold dark:text-white">$129.00</p>
                    <p className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-bold uppercase">Paid</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Leather Messenger Bag', stock: 3 },
                { name: 'Minimalist Watch', stock: 1 },
                { name: 'Premium Headphones', stock: 5 },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-neutral-800 flex items-center justify-center">
                      <Package size={20} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold dark:text-white">{item.name}</p>
                      <p className="text-xs text-gray-500">Electronics / Accessories</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-500">{item.stock} left</p>
                    <button className="text-[10px] font-bold uppercase tracking-widest hover:underline">Restock</button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;

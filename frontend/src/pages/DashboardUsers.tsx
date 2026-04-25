import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../lib/apiService';
import { 
  Search, 
  MoreHorizontal, 
  Mail, 
  Shield, 
  Calendar,
  User as UserIcon,
  Edit,
  X,
  UserCheck,
  UserMinus,
  RotateCcw,
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
import { toast } from 'react-toastify';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  joinedDate: string;
  status: 'active' | 'suspended' | 'unverified';
}

const DashboardUsers: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(apiUrl('/admin/users'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const usersData = Array.isArray(res.data) ? res.data : (res.data.users || []);
      
      const mappedUsers = usersData.map((u: any) => ({
        id: u._id,
        name: u.fullName || 'No Name',
        email: u.email,
        role: u.role || 'user',
        joinedDate: new Date(u.createdAt).toLocaleDateString(),
        status: u.isSuspended ? 'suspended' : (u.isEmailVerified ? 'active' : 'unverified')
      }));
      
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSuspend = async (user: UserData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }
      
      console.log('🔄 Suspending user:', user.id, user.name);
      
      const res = await axios.patch(apiUrl(`/admin/users/${user.id}/suspend`), {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Suspend response:', res.data);
      toast.success(res.data.message);
      fetchUsers();
    } catch (error: any) {
      console.error('❌ Suspend error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || error.message || 'Action failed');
    }
  };

  const handleEmailUser = (email: string) => {
    console.log('🔍 Email clicked:', email);
    
    // Simple direct approach - use mailto for maximum compatibility
    const mailtoUrl = `mailto:${email}`;
    
    // Open in new window/tab
    window.open(mailtoUrl, '_blank');
    
    // Also try Gmail as backup
    setTimeout(() => {
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
      window.open(gmailUrl, '_blank');
    }, 500);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    
    // Role filter
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    
    // Date filter
    const userDate = new Date(u.joinedDate);
    const today = new Date();
    let matchesDate = true;
    
    if (dateFilter === 'today') {
      matchesDate = userDate.toDateString() === today.toDateString();
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = userDate >= weekAgo;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesDate = userDate >= monthAgo;
    }
    
    return matchesSearch && matchesStatus && matchesRole && matchesDate;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Monitor and manage registered users on the platform.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search users by name or email..." 
            className="pl-12 h-12 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm rounded-2xl h-12 px-4">
                <Filter size={18} className="mr-2" />
                Status: {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark:bg-neutral-900 shadow-2xl border border-gray-200 dark:border-neutral-800 min-w-[150px] rounded-xl p-2">
              <DropdownMenuItem onClick={() => setStatusFilter('all')} className="rounded-lg px-3 py-2 cursor-pointer">
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('active')} className="rounded-lg px-3 py-2 cursor-pointer">
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('suspended')} className="rounded-lg px-3 py-2 cursor-pointer">
                Suspended
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('unverified')} className="rounded-lg px-3 py-2 cursor-pointer">
                Unverified
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm rounded-2xl h-12 px-4">
                <Filter size={18} className="mr-2" />
                Role: {roleFilter === 'all' ? 'All' : roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark:bg-neutral-900 shadow-2xl border border-gray-200 dark:border-neutral-800 min-w-[150px] rounded-xl p-2">
              <DropdownMenuItem onClick={() => setRoleFilter('all')} className="rounded-lg px-3 py-2 cursor-pointer">
                All Roles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter('admin')} className="rounded-lg px-3 py-2 cursor-pointer">
                Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter('user')} className="rounded-lg px-3 py-2 cursor-pointer">
                User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm rounded-2xl h-12 px-4">
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

      <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm overflow-hidden border border-gray-100 dark:border-neutral-800">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-gray-100 dark:border-neutral-800">
              <TableHead className="py-5 pl-8 font-bold text-gray-400 uppercase text-[10px] tracking-widest">User</TableHead>
              <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Role</TableHead>
              <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Joined</TableHead>
              <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Status</TableHead>
              <TableHead className="text-right pr-8 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20">
                   <div className="flex flex-col items-center">
                      <RotateCcw className="animate-spin text-gray-300 mb-2" size={32} />
                      <p className="text-gray-400 font-medium">Fetching users...</p>
                   </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-gray-500">No users found.</TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-gray-100 dark:border-neutral-800 group hover:bg-gray-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                  <TableCell className="pl-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-500 font-bold uppercase shadow-inner">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold dark:text-white text-base">{user.name}</p>
                        <button
                          onClick={() => handleEmailUser(user.email)}
                          className="text-xs text-gray-500 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline decoration-0 hover:underline cursor-pointer"
                          title={`Send email to ${user.email}`}
                        >
                          {user.email}
                        </button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={user.role === 'admin' 
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-bold' 
                        : 'bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 border-none font-medium'
                      }
                    >
                      {user.role === 'admin' && <Shield size={10} className="mr-1.5" />}
                      {user.role.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2 opacity-50" />
                      {user.joinedDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      user.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-none px-3' : 
                      user.status === 'suspended' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-none px-3' :
                      'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-none px-3'
                    }>
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        user.status === 'active' ? 'bg-green-500' : 
                        user.status === 'suspended' ? 'bg-red-500' : 'bg-orange-500'
                      }`} />
                      {user.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-10 w-10 p-0 cursor-pointer text-gray-400 hover:text-black dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800">
                          <MoreHorizontal size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="dark:bg-neutral-900 shadow-2xl border border-gray-200 dark:border-neutral-800 min-w-[180px] rounded-2xl p-2">
                        <DropdownMenuLabel className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-widest text-gray-400">User Actions</DropdownMenuLabel>
                        <DropdownMenuItem 
                          className="rounded-xl px-3 py-2.5 cursor-pointer"
                          onClick={() => handleEmailUser(user.email)}
                        >
                          <Mail size={16} className="mr-3 text-gray-400" />
                          <span className="font-medium">Email User</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                          <Link to={`/dashboard/users/edit/${user.id}`} className="flex items-center w-full">
                            <Edit size={16} className="mr-3 text-gray-400" />
                            <span className="font-medium">Edit Details</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="mx-2 my-2 dark:bg-neutral-800" />
                        <DropdownMenuItem 
                          className={`rounded-xl px-3 py-2.5 cursor-pointer ${user.status === 'suspended' ? 'text-green-600 focus:text-green-600' : 'text-red-500 focus:text-red-500'}`}
                          onSelect={() => handleSuspend(user)}
                        >
                          {user.status === 'suspended' ? (
                            <><UserCheck size={16} className="mr-3" /> <span className="font-bold">Reactivate Account</span></>
                          ) : (
                            <><UserMinus size={16} className="mr-3" /> <span className="font-bold">Suspend Account</span></>
                          )}
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

export default DashboardUsers;

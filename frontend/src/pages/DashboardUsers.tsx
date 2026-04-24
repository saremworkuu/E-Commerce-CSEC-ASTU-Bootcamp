import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import axios from 'axios';
import { apiUrl } from '../lib/api';
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
  RotateCcw
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(apiUrl('/admin/users'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const mappedUsers = res.data.map((u: any) => ({
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
      const res = await axios.patch(apiUrl(`/admin/users/${user.id}/suspend`), {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(res.data.message);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleEmailUser = (email: string) => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;
    window.open(gmailUrl, '_blank');
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Monitor and manage registered users on the platform.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search users by name or email..." 
            className="pl-12 h-12 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
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
                        <p className="text-xs text-gray-500 font-medium">{user.email}</p>
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
                        <DropdownMenuItem onSelect={() => handleEmailUser(user.email)} className="rounded-xl px-3 py-2.5 cursor-pointer">
                          <Mail size={16} className="mr-3 text-gray-400" />
                          <span className="font-medium">Email User</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 cursor-pointer">
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

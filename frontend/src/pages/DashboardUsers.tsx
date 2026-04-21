import React, { useState } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  Mail, 
  Shield, 
  Calendar,
  User as UserIcon,
  Edit
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

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  joinedDate: string;
  status: 'active' | 'inactive';
}

const DashboardUsers: React.FC = () => {
  const [users] = useState<UserData[]>([
    { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', joinedDate: '2026-01-15', status: 'active' },
    { id: '2', name: 'John Doe', email: 'john@example.com', role: 'user', joinedDate: '2026-02-10', status: 'active' },
    { id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'user', joinedDate: '2026-03-05', status: 'active' },
    { id: '4', name: 'Bob Wilson', email: 'bob@example.com', role: 'user', joinedDate: '2026-03-12', status: 'inactive' },
    { id: '5', name: 'Alice Brown', email: 'alice@example.com', role: 'user', joinedDate: '2026-03-20', status: 'active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">User Management</h1>
        <p className="text-gray-500 dark:text-gray-400">Monitor and manage registered users on the platform.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search users by name or email..." 
            className="pl-10 bg-white dark:bg-neutral-900 border-none shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-neutral-800">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-gray-100 dark:border-neutral-800">
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-gray-100 dark:border-neutral-800">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-500">
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <p className="font-bold dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={user.role === 'admin' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 border-none'}
                  >
                    {user.role === 'admin' && <Shield size={12} className="mr-1" />}
                    {user.role.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-2" />
                    {user.joinedDate}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={user.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-none' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-none'}>
                    {user.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
                        <MoreHorizontal size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="dark:bg-neutral-900 shadow-xl border border-gray-200 dark:border-neutral-800">
                      <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Mail size={14} className="mr-2" />
                        Email User
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit size={14} className="mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="dark:bg-neutral-800" />
                      <DropdownMenuItem className="text-red-500 focus:text-red-500">
                        Suspend Account
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

export default DashboardUsers;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../lib/apiService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'react-toastify';
import { ChevronLeft, Save, RotateCcw, User, Mail, Shield } from 'lucide-react';
import { motion } from 'motion/react';

const DashboardUserEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'user' as 'user' | 'admin'
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(apiUrl('/admin/users'), {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Since we don't have a single user fetch endpoint for admin yet, 
        // we find it from the list or I should have added a single fetch endpoint.
        // Wait, I'll check if I added a single fetch endpoint. 
        // I didn't in my previous turn, only PUT. 
        // Let's assume we can fetch it now.
        const users = Array.isArray(res.data) ? res.data : [];
        const user = users.find((u: any) => u._id === id);
        
        if (user) {
          setFormData({
            fullName: user.fullName || '',
            email: user.email || '',
            role: user.role || 'user'
          });
        } else {
          console.error('User not found in list:', id);
          toast.error('User not found');
          navigate('/dashboard/users');
        }

      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(apiUrl(`/admin/users/${id}`), formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('User updated successfully');
      navigate('/dashboard/users');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RotateCcw className="animate-spin text-gray-300 mr-3" size={24} />
        <span className="text-gray-500 font-medium">Loading user data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard/users')}
            className="rounded-full h-10 w-10 p-0"
          >
            <ChevronLeft size={24} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight dark:text-white">Edit User</h1>
            <p className="text-gray-500 dark:text-gray-400">Modify profile and permissions for this account.</p>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-[2.5rem] p-10 shadow-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={18} />
                <Input 
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="pl-14 h-14 bg-gray-50 dark:bg-neutral-800 border-none rounded-2xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={18} />
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="pl-14 h-14 bg-gray-50 dark:bg-neutral-800 border-none rounded-2xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Account Role</Label>
              <div className="relative group">
                <Shield className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                <Select 
                  value={formData.role} 
                  onValueChange={(v: any) => setFormData({ ...formData, role: v })}
                >
                  <SelectTrigger className="pl-14 h-14 bg-gray-50 dark:bg-neutral-800 border-none rounded-2xl">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-neutral-900 border-neutral-800">
                    <SelectItem value="user">Standard User</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-50 dark:border-neutral-800 flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => navigate('/dashboard/users')}
              className="rounded-xl px-8 h-12 font-bold"
            >
              Discard
            </Button>
            <Button 
              type="submit" 
              disabled={saving}
              className="bg-black text-white dark:bg-white dark:text-black rounded-xl px-10 h-12 font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
            >
              {saving ? (
                <><RotateCcw className="animate-spin mr-2" size={18} /> Saving...</>
              ) : (
                <><Save className="mr-2" size={18} /> Update User</>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default DashboardUserEdit;

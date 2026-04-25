import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Mail, Search, Trash2, RefreshCcw } from 'lucide-react';
import { apiUrl } from '../lib/apiService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type MessageStatus = 'unread' | 'read' | 'replied';

interface ContactMessage {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
}

const statusClasses: Record<MessageStatus, string> = {
  unread: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  read: 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-gray-300',
  replied: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

const DashboardMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | MessageStatus>('all');

  const getToken = () => localStorage.getItem('token');

  const authHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
  });

  const fetchMessages = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await axios.get<ContactMessage[]>(apiUrl('/admin/messages'), {
        headers: authHeaders(),
      });

      setMessages(res.data);

      if (selectedMessage) {
        const latestSelected = res.data.find((entry) => entry._id === selectedMessage._id) || null;
        setSelectedMessage(latestSelected);
      }
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        // Token is stale or invalid — clear it and redirect to admin login
        localStorage.removeItem('token');
        localStorage.removeItem('auth_user');
        window.location.href = '/admin';
        return;
      }
      setError(err.response?.data?.message || 'Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return messages.filter((entry) => {
      const fullName = `${entry.firstName} ${entry.lastName}`.toLowerCase();
      const matchSearch =
        !normalizedSearch ||
        fullName.includes(normalizedSearch) ||
        entry.email.toLowerCase().includes(normalizedSearch) ||
        entry.message.toLowerCase().includes(normalizedSearch);

      const matchStatus = statusFilter === 'all' || entry.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [messages, search, statusFilter]);

  const openMessage = async (entry: ContactMessage) => {
    setSelectedMessage(entry);

    if (entry.status !== 'unread') {
      return;
    }

    await updateStatus(entry._id, 'read');
  };

  const updateStatus = async (id: string, status: MessageStatus) => {
    try {
      setActionLoading(true);
      const res = await axios.patch<ContactMessage>(
        apiUrl(`/admin/messages/${id}`),
        { status },
        { headers: authHeaders() }
      );

      setMessages((prev) => prev.map((entry) => (entry._id === id ? res.data : entry)));
      setSelectedMessage((prev) => (prev && prev._id === id ? res.data : prev));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update message status.');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      setActionLoading(true);
      await axios.delete(apiUrl(`/admin/messages/${id}`), {
        headers: authHeaders(),
      });

      setMessages((prev) => prev.filter((entry) => entry._id !== id));
      setSelectedMessage((prev) => (prev?._id === id ? null : prev));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete message.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">Messages</h1>
          <p className="text-gray-500 dark:text-gray-400">Review and manage all contact submissions.</p>
        </div>

        <Button
          onClick={fetchMessages}
          variant="outline"
          disabled={loading || actionLoading}
          className="w-full lg:w-auto"
        >
          <RefreshCcw size={16} className="mr-2" /> Refresh
        </Button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden">
          <div className="p-4 md:p-5 border-b border-gray-100 dark:border-neutral-800 space-y-3 md:space-y-0 md:flex md:items-center md:gap-3">
            <div className="relative grow">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, or message"
                className="pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | MessageStatus)}
              className="h-10 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 text-sm dark:text-white"
            >
              <option value="all">All statuses</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500 dark:text-gray-400">Loading messages...</div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-10 text-center text-gray-500 dark:text-gray-400">No messages found.</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-neutral-800">
              {filteredMessages.map((entry) => {
                const isUnread = entry.status === 'unread';
                const isSelected = selectedMessage?._id === entry._id;
                return (
                  <button
                    key={entry._id}
                    onClick={() => openMessage(entry)}
                    className={`w-full text-left p-4 md:p-5 transition-colors ${
                      isSelected
                        ? 'bg-gray-100 dark:bg-neutral-800/70'
                        : isUnread
                        ? 'bg-blue-50/60 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                        : 'hover:bg-gray-50 dark:hover:bg-neutral-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {entry.firstName} {entry.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{entry.email}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${statusClasses[entry.status]}`}>
                        {entry.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {entry.message}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-4 md:p-5">
          {!selectedMessage ? (
            <div className="h-full min-h-52 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
              <Mail size={26} className="mb-3" />
              <p>Select a message to view full details.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">From</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedMessage.firstName} {selectedMessage.lastName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedMessage.email}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">Received</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Message</p>
                <Textarea
                  readOnly
                  value={selectedMessage.message}
                  className="min-h-36 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  disabled={actionLoading}
                  onClick={() => updateStatus(selectedMessage._id, 'read')}
                >
                  Mark Read
                </Button>
                <Button
                  variant="outline"
                  disabled={actionLoading}
                  onClick={() => updateStatus(selectedMessage._id, 'replied')}
                >
                  Mark Replied
                </Button>
              </div>

              <Button
                variant="outline"
                disabled={actionLoading}
                onClick={() => deleteMessage(selectedMessage._id)}
                className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                <Trash2 size={16} className="mr-2" /> Delete Message
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardMessages;

import React, { useState, useEffect } from 'react';
import { Users, Trash2, Shield, ShieldAlert, Search, RefreshCw, ArrowLeft } from 'lucide-react';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
}

export function AdminDashboard({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsers(users.filter(u => u.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRoleChange = async (id: number, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (!res.ok) throw new Error('Failed to update role');
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.first_name && u.first_name.toLowerCase().includes(search.toLowerCase())) ||
    (u.last_name && u.last_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('settings')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <button onClick={fetchUsers} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="p-6 flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Admins</p>
                <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'admin').length}</p>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Manage Users</h2>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading && users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading users...</td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No users found.</td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                              {user.first_name ? user.first_name[0].toUpperCase() : user.email[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className={`text-sm rounded-full px-3 py-1 font-medium border-0 focus:ring-2 ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-700 focus:ring-purple-500' 
                                : 'bg-gray-100 text-gray-700 focus:ring-gray-500'
                            }`}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

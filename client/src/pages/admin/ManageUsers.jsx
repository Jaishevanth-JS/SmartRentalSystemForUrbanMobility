import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';
import { Users, Search, Ban, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (id, isBlocked) => {
    try {
      const res = await API.put(`/admin/users/${id}/block`);
      setUsers(users.map(u => u._id === id ? { ...u, isBlocked: res.data.isBlocked } : u));
      toast.success(`User ${res.data.isBlocked ? 'blocked' : 'unblocked'} successfully`);
    } catch (err) {
      console.error(err);
      toast.error('Error updating user status');
    }
  };

  const filtered = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Manage Users">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#e2d5c3] rounded-2xl focus:outline-none focus:border-[#8b5e3c] shadow-sm font-medium"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#e2d5c3] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#8b5e3c] mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Users className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-black text-[#4a3224]">No users registered yet</h3>
            <p className="text-gray-400 mt-2">When users join, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#fdfaf6] border-b border-[#e2d5c3]">
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f0eb]">
                {filtered.map(user => (
                  <tr key={user._id} className="hover:bg-[#fdfaf6] transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#f0e9df] flex items-center justify-center font-bold text-[#8b5e3c]">
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-[#4a3224]">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}{user.phone ? ` • ${user.phone}` : ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${
                        user.role === 'Vendor' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {user.isBlocked ? (
                        <span className="inline-flex items-center gap-1 text-xs font-black bg-red-100 text-red-700 px-3 py-1 rounded-full"><Ban className="h-3 w-3" /> Blocked</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-black bg-green-100 text-green-700 px-3 py-1 rounded-full"><CheckCircle className="h-3 w-3" /> Active</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => toggleBlock(user._id, user.isBlocked)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                          user.isBlocked 
                            ? 'border-gray-300 text-gray-700 hover:bg-gray-100' 
                            : 'border-red-200 text-red-600 hover:bg-red-50'
                        }`}
                      >
                        {user.isBlocked ? 'Unblock' : 'Block User'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;

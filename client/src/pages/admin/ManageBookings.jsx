import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';
import { CalendarCheck, Search, Filter } from 'lucide-react';

const statusMap = {
  upcoming:  { label: 'Upcoming',  cls: 'bg-blue-100 text-blue-700' },
  active:    { label: 'Active',    cls: 'bg-green-100 text-green-700' },
  completed: { label: 'Completed', cls: 'bg-gray-100 text-gray-600' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-600' },
};

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get('/admin/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = bookings.filter(b => {
    const matchesSearch = b._id.includes(searchTerm) || 
                          b.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || b.bookingStatus === filter;
    return matchesSearch && matchesFilter;
  });

  const fmt = (d) => {
    if (!d) return '—';
    const date = new Date(d);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + 
           date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <AdminLayout title="Manage Bookings">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by User or Booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#e2d5c3] rounded-xl focus:outline-none focus:border-[#8b5e3c] shadow-sm text-sm font-medium"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all','upcoming','active','completed','cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition capitalize
                ${filter === s ? 'bg-[#8b5e3c] text-white shadow-sm' : 'bg-white border border-[#e2d5c3] text-gray-500 hover:border-[#8b5e3c] hover:text-[#8b5e3c]'}`}>
              {s === 'all' ? `All` : s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2d5c3] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#8b5e3c] mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <CalendarCheck className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-black text-[#4a3224]">No bookings found</h3>
            <p className="text-gray-400 mt-2">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#fdfaf6] border-b border-[#e2d5c3]">
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Bike</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Amount/Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f0eb]">
                {filtered.map(b => {
                  const s = statusMap[b.bookingStatus] || { label: b.bookingStatus, cls: 'bg-gray-100 text-gray-500' };
                  return (
                    <tr key={b._id} className="hover:bg-[#fdfaf6] transition">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-gray-500">{b._id.slice(-8).toUpperCase()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-black text-[#4a3224] text-sm">{b.userId?.name}</p>
                        <p className="text-[10px] text-gray-400">{b.userId?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-700 text-sm">{b.bikeId?.brand} {b.bikeId?.model}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-[#8b5e3c]">{fmt(b.startDate)}</p>
                        <p className="text-xs text-gray-400 mt-0.5">to {fmt(b.endDate)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-black text-green-600 text-sm">₹{b.totalAmount}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">{b.paymentStatus}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-[10px] uppercase font-black tracking-wider ${s.cls}`}>{s.label}</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageBookings;

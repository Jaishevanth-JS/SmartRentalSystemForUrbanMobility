import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import VendorLayout from '../../components/VendorLayout';
import { CalendarCheck, Bike, User, IndianRupee } from 'lucide-react';

const statusMap = {
  upcoming:  { label: 'Upcoming',  cls: 'bg-blue-100 text-blue-700' },
  active:    { label: 'Active',    cls: 'bg-green-100 text-green-700' },
  completed: { label: 'Completed', cls: 'bg-gray-100 text-gray-500' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-500' },
};

const VendorBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/bookings/vendor/bookings');
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.bookingStatus === filter);

  const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <VendorLayout title="Bookings">
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all','upcoming','active','completed','cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition capitalize
              ${filter === s ? 'bg-[#8b5e3c] text-white shadow-sm' : 'bg-white border border-[#e2d5c3] text-gray-500 hover:border-[#8b5e3c] hover:text-[#8b5e3c]'}`}>
            {s === 'all' ? `All (${bookings.length})` : `${s.charAt(0).toUpperCase()+s.slice(1)} (${bookings.filter(b=>b.bookingStatus===s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5e3c]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-[#e2d5c3] p-16 text-center">
          <CalendarCheck className="h-14 w-14 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-black text-[#4a3224] mb-2">No booking requests yet</h3>
          <p className="text-gray-400 text-sm">Bookings for your bikes will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(b => {
            const s = statusMap[b.bookingStatus] || { label: b.bookingStatus, cls: 'bg-gray-100 text-gray-500' };
            return (
              <div key={b._id} className="bg-white rounded-2xl border border-[#e2d5c3] shadow-sm p-5 hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Bike image */}
                  <div className="h-20 w-28 rounded-xl bg-[#f5f0eb] overflow-hidden flex-shrink-0">
                    {b.bikeId?.images?.[0]
                      ? <img src={b.bikeId.images[0]} alt="" className="h-full w-full object-cover" />
                      : <div className="h-full flex items-center justify-center text-gray-300"><Bike className="h-8 w-8" /></div>
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <p className="font-black text-[#4a3224]">{b.bikeId?.brand} {b.bikeId?.model}</p>
                        <p className="text-xs text-gray-400">{b.bikeId?.city}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${s.cls}`}>{s.label}</span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-[#8b5e3c] flex-shrink-0" />
                        <div>
                          <p className="font-bold text-[#4a3224] text-xs">{b.userId?.name}</p>
                          <p className="text-[10px] text-gray-400">{b.userId?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarCheck className="h-4 w-4 text-[#8b5e3c] flex-shrink-0" />
                        <div>
                          <p className="font-bold text-[#4a3224] text-xs">{fmt(b.startDate)}</p>
                          <p className="text-[10px] text-gray-400">to {fmt(b.endDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <IndianRupee className="h-4 w-4 text-[#8b5e3c] flex-shrink-0" />
                        <div>
                          <p className="font-black text-[#4a3224]">₹{b.totalAmount}</p>
                          <p className="text-[10px] text-gray-400 capitalize">{b.paymentStatus}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </VendorLayout>
  );
};

export default VendorBookings;

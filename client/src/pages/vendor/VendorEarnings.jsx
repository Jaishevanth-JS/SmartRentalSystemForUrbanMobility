import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import VendorLayout from '../../components/VendorLayout';
import { IndianRupee, TrendingUp, Bike, User, CalendarCheck } from 'lucide-react';

const VendorEarnings = () => {
  const [data, setData]     = useState({ bookings: [], totalEarnings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/vendor/earnings');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const fmt = (d) => new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <VendorLayout title="Earnings">
      {/* Summary card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#8b5e3c] to-[#6f4b30] text-white rounded-2xl p-6 shadow-lg sm:col-span-1">
          <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-2">Total Earnings</p>
          <p className="text-4xl font-black">₹{data.totalEarnings.toLocaleString('en-IN')}</p>
          <p className="text-xs opacity-60 mt-2">From {data.bookings.length} completed ride{data.bookings.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#e2d5c3] shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Completed Trips</p>
            <p className="text-3xl font-black text-[#4a3224]">{data.bookings.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#e2d5c3] shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <IndianRupee className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Avg per Trip</p>
            <p className="text-3xl font-black text-[#4a3224]">
              ₹{data.bookings.length > 0 ? Math.round(data.totalEarnings / data.bookings.length).toLocaleString('en-IN') : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Earnings History */}
      <div className="bg-white rounded-2xl border border-[#e2d5c3] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#f0e9df]">
          <h3 className="font-black text-[#4a3224]">Earnings History</h3>
          <p className="text-xs text-gray-400 mt-0.5">All completed bookings with payout details</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#8b5e3c]" />
          </div>
        ) : data.bookings.length === 0 ? (
          <div className="py-16 text-center">
            <TrendingUp className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-black text-[#4a3224] mb-2">No earnings yet</h3>
            <p className="text-gray-400 text-sm">Completed bookings will appear here with payout details.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#f5f0eb]">
            {data.bookings.map(b => (
              <div key={b._id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-5 hover:bg-[#fdfaf6] transition">
                {/* Bike image */}
                <div className="h-16 w-24 rounded-xl bg-[#f5f0eb] overflow-hidden flex-shrink-0">
                  {b.bikeId?.images?.[0]
                    ? <img src={b.bikeId.images[0]} alt="" className="h-full w-full object-cover" />
                    : <div className="h-full flex items-center justify-center text-gray-300"><Bike className="h-6 w-6" /></div>
                  }
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-[#4a3224]">{b.bikeId?.brand} {b.bikeId?.model}</p>
                  <div className="flex flex-wrap gap-4 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <User className="h-3.5 w-3.5" /> {b.userId?.name}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <CalendarCheck className="h-3.5 w-3.5" /> {fmt(b.startDate)} → {fmt(b.endDate)}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-black text-green-600">+₹{b.totalAmount.toLocaleString('en-IN')}</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-black">Completed</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </VendorLayout>
  );
};

export default VendorEarnings;

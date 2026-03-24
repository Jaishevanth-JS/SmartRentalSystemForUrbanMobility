import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import VendorLayout from '../../components/VendorLayout';
import {
  Bike, CalendarCheck, IndianRupee, Clock, Plus,
  TrendingUp, ArrowRight, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="bg-white rounded-2xl p-6 border border-[#e2d5c3] shadow-sm hover:shadow-md transition-all">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
        <p className={`text-3xl font-black ${color}`}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${color.replace('text-','bg-').replace('-600','-100')}`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
    </div>
  </div>
);

const VendorOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats]       = useState(null);
  const [bikes, setBikes]       = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, bikesRes, bookingsRes] = await Promise.all([
          API.get('/vendor/stats'),
          API.get('/vendor/bikes'),
          API.get('/vendor/bookings'),
        ]);
        const allBikes = bikesRes.data;
        const liveBikesCount = allBikes.filter(b => b.isApproved === true).length;
        const pendingBikesCount = allBikes.filter(b => b.isApproved === false).length;

        setStats({
          ...statsRes.data,
          totalBikes: liveBikesCount,
          pendingBikes: pendingBikesCount
        });
        setBikes(allBikes.slice(0, 3));
        setBookings(bookingsRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return (
    <VendorLayout title="Dashboard Overview">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5e3c]" />
      </div>
    </VendorLayout>
  );

  const statusBadge = (status) => {
    const map = {
      upcoming:  { label: 'Upcoming',  cls: 'bg-blue-100 text-blue-700' },
      active:    { label: 'Active',    cls: 'bg-green-100 text-green-700' },
      completed: { label: 'Completed', cls: 'bg-gray-100 text-gray-600' },
      cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-600' },
    };
    const s = map[status] || { label: status, cls: 'bg-gray-100 text-gray-600' };
    return <span className={`text-xs px-3 py-1 rounded-full font-black ${s.cls}`}>{s.label}</span>;
  };

  return (
    <VendorLayout title="Dashboard Overview">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Bike}        label="Total Bikes"      value={stats?.totalBikes ?? 0}    color="text-blue-600"   sub="Listed on platform" />
        <StatCard icon={CalendarCheck} label="Total Bookings" value={stats?.totalBookings ?? 0}  color="text-purple-600" sub="All time" />
        <StatCard icon={IndianRupee} label="Total Earnings"   value={`₹${stats?.totalEarnings ?? 0}`} color="text-green-600" sub="From completed rides" />
        <StatCard icon={Clock}       label="Pending Requests" value={stats?.pendingBikes ?? 0} color="text-orange-500" sub="Awaiting action" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Bikes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e2d5c3] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0e9df]">
            <h3 className="font-black text-[#4a3224]">Recent Bikes</h3>
            <button onClick={() => navigate('/vendor/bikes')}
              className="text-xs text-[#8b5e3c] font-bold hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          {bikes.length === 0 ? (
            <div className="py-12 text-center px-6">
              <Bike className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No bikes listed yet.</p>
              <button onClick={() => navigate('/vendor/add-bike')}
                className="mt-3 text-[#8b5e3c] text-sm font-bold hover:underline flex items-center gap-1 mx-auto">
                <Plus className="h-4 w-4" /> Add your first bike
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#f5f0eb]">
              {bikes.map(bike => (
                <div key={bike._id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#fdfaf6] transition">
                  <div className="h-12 w-16 rounded-xl bg-[#f5f0eb] overflow-hidden flex-shrink-0">
                    {bike.images?.[0]
                      ? <img src={bike.images[0]} alt="" className="h-full w-full object-cover" />
                      : <div className="h-full w-full flex items-center justify-center text-gray-300"><Bike className="h-5 w-5" /></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-[#4a3224] text-sm truncate">{bike.brand} {bike.model}</p>
                    <p className="text-xs text-gray-400">₹{bike.pricePerDay}/day · {bike.city}</p>
                  </div>
                  {bike.isApproved
                    ? <span className="flex-shrink-0 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-black">Live</span>
                    : bike.isApproved === false
                      ? <span className="flex-shrink-0 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-black">Pending</span>
                      : null
                  }
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#e2d5c3] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0e9df]">
            <h3 className="font-black text-[#4a3224]">Recent Bookings</h3>
            <button onClick={() => navigate('/vendor/bookings')}
              className="text-xs text-[#8b5e3c] font-bold hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          {bookings.length === 0 ? (
            <div className="py-12 text-center px-6">
              <CalendarCheck className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No booking requests yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#f5f0eb]">
              {bookings.map(b => (
                <div key={b._id} className="flex items-center justify-between px-6 py-4 hover:bg-[#fdfaf6] transition gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-[#4a3224] text-sm">{b.userId?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{b.bikeId?.brand} {b.bikeId?.model}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(b.startDate).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })} → {new Date(b.endDate).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-[#4a3224]">₹{b.totalAmount}</p>
                    {statusBadge(b.bookingStatus)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Add New Bike',    icon: Plus,         path: '/vendor/add-bike',  cls: 'bg-[#8b5e3c] text-white hover:bg-[#6f4b30]' },
          { label: 'View Bookings',   icon: CalendarCheck, path: '/vendor/bookings', cls: 'bg-white border border-[#e2d5c3] text-[#4a3224] hover:bg-[#fdfaf6]' },
          { label: 'View Earnings',   icon: TrendingUp,   path: '/vendor/earnings', cls: 'bg-white border border-[#e2d5c3] text-[#4a3224] hover:bg-[#fdfaf6]' },
        ].map(({ label, icon: Icon, path, cls }) => (
          <button key={path} onClick={() => navigate(path)}
            className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-black transition shadow-sm ${cls}`}>
            <Icon className="h-5 w-5" /> {label}
          </button>
        ))}
      </div>
    </VendorLayout>
  );
};

export default VendorOverview;

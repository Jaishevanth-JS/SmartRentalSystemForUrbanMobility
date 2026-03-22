import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';
import { Users, Bike, CalendarCheck, IndianRupee, Store } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl p-6 border border-[#e2d5c3] shadow-sm hover:shadow-md transition-all">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
        <p className={`text-3xl font-black ${color}`}>{value}</p>
      </div>
      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${color.replace('text-', 'bg-').replace('-600', '-100').replace('-500', '-100')}`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
    </div>
  </div>
);

const AdminOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get(`/admin/stats?t=${new Date().getTime()}`);
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <AdminLayout title="Platform Overview">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5e3c]" />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Platform Overview">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        <StatCard icon={Users} label="Total Users" value={stats?.totalUsers || 0} color="text-blue-500" />
        <StatCard icon={Store} label="Total Vendors" value={stats?.totalVendors || 0} color="text-purple-500" />
        <StatCard icon={Bike} label="Approved Bikes" value={stats?.approvedBikes || 0} color="text-green-500" />
        <StatCard icon={Bike} label="Pending Bikes" value={stats?.pendingBikes || 0} color="text-orange-500" />
        <StatCard icon={CalendarCheck} label="Total Bookings" value={stats?.totalBookings || 0} color="text-teal-500" />
        <StatCard icon={IndianRupee} label="Total Revenue" value={`₹${stats?.totalRevenue?.toLocaleString('en-IN') || 0}`} color="text-green-600" />
      </div>

      <div className="bg-gradient-to-br from-[#8b5e3c] to-[#6f4b30] text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Welcome back, Admin!</h2>
          <p className="text-lg opacity-90 max-w-2xl mb-8">
            Manage your entire bike rental platform from this dashboard. Approve incoming bikes, monitor multi-vendor activity, and keep track of revenue streams.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate('/admin/pending')} className="bg-white text-[#8b5e3c] px-6 py-3 rounded-xl font-black hover:bg-gray-50 transition shadow-lg">
              Review Pending Bikes
            </button>
            <button onClick={() => navigate('/admin/users')} className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold transition backdrop-blur-sm border border-white/20">
              Manage Users
            </button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Bike className="h-64 w-64 transform rotate-[-15deg] translate-x-12 -translate-y-12" />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;

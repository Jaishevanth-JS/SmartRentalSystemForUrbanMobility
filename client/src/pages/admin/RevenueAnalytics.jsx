import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';
import { TrendingUp, FileText, CheckCircle, Clock, Calendar } from 'lucide-react';

const RevenueAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsRes = await API.get('/admin/bookings');
        const bks = bookingsRes.data;

        const completed = bks.filter(b => b.bookingStatus === 'completed');
        const totalRevenue = completed.reduce((sum, b) => sum + b.totalAmount, 0);

        // Group by month
        const monthly = {};
        completed.forEach(b => {
          const date = new Date(b.endDate);
          const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
          if (!monthly[monthYear]) monthly[monthYear] = 0;
          monthly[monthYear] += b.totalAmount;
        });

        // Convert to array and sort
        const monthlyArr = Object.entries(monthly).map(([month, revenue]) => ({ month, revenue }));

        setData({
          totalRevenue,
          completedCount: completed.length,
          monthly: monthlyArr,
          allBookingsCount: bks.length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <AdminLayout title="Revenue & Analytics">
      <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5e3c]" /></div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Revenue & Analytics">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#8b5e3c] to-[#6f4b30] text-white rounded-3xl p-8 shadow-xl">
          <TrendingUp className="h-8 w-8 text-white/50 mb-4" />
          <p className="text-sm font-black uppercase tracking-widest opacity-80 mb-2">Platform Revenue</p>
          <p className="text-4xl md:text-5xl font-black">₹{data?.totalRevenue?.toLocaleString('en-IN')}</p>
        </div>
        
        <div className="bg-white rounded-3xl p-8 border border-[#e2d5c3] shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-black text-gray-500 uppercase tracking-widest">Completed Trips</p>
          </div>
          <p className="text-4xl font-black text-[#4a3224] ml-16">{data?.completedCount}</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#e2d5c3] shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm font-black text-gray-500 uppercase tracking-widest">Total Bookings</p>
          </div>
          <p className="text-4xl font-black text-[#4a3224] ml-16">{data?.allBookingsCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#e2d5c3] shadow-sm overflow-hidden p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-6 w-6 text-[#8b5e3c]" />
          <h3 className="text-xl font-black text-[#4a3224]">Monthly Revenue Trends</h3>
        </div>
        
        {data?.monthly.length === 0 ? (
          <div className="py-12 text-center">
            <TrendingUp className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No completed bookings revenue to show yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.monthly.map((m, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 bg-[#fdfaf6] rounded-xl border border-[#e2d5c3]">
                <span className="font-bold text-gray-700">{m.month}</span>
                <span className="font-black text-green-600">₹{m.revenue.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default RevenueAnalytics;

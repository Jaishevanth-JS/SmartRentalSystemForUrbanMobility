import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import { Bike, Calendar, Clock, ArrowRight, User, Settings, LayoutDashboard, PlusCircle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const UserDashboard = () => {
    const [stats, setStats] = useState({ active: 0, completed: 0, cancelled: 0 });
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await API.get('/bookings/my-bookings');
                const bookings = res.data;
                const active = bookings.filter(b => b.bookingStatus === 'active' || b.bookingStatus === 'upcoming').length;
                const completed = bookings.filter(b => b.bookingStatus === 'completed').length;
                const cancelled = bookings.filter(b => b.bookingStatus === 'cancelled').length;
                setStats({ active, completed, cancelled });
                setRecentBookings(bookings.slice(0, 3));
            } catch (err) {
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen bg-[#fdfaf6] flex flex-col">
            <Navbar />
            
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="mb-10">
                    <h1 className="text-3xl font-extrabold text-[#4a3224] flex items-center">
                        <LayoutDashboard className="h-8 w-8 mr-3 text-[#8b5e3c]" />
                        Welcome back, <span className="text-[#8b5e3c] ml-2">{user.name}!</span>
                    </h1>
                    <p className="text-[#6f4b30] mt-2">Manage your rentals, view activity, and update your profile.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="card-brown p-8 flex items-center gap-6 border-l-[6px] border-l-blue-500 shadow-lg relative overflow-hidden group">
                        <div className="bg-blue-50 p-4 rounded-2xl text-blue-500 group-hover:scale-110 transition duration-300">
                            <Clock className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Bookings</p>
                            <h3 className="text-4xl font-black text-[#4a3224]">{stats.active}</h3>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 group-hover:scale-110 transition duration-300">
                             <Clock className="h-24 w-24" />
                        </div>
                    </div>
                    <div className="card-brown p-8 flex items-center gap-6 border-l-[6px] border-l-green-500 shadow-lg relative overflow-hidden group">
                        <div className="bg-green-50 p-4 rounded-2xl text-green-500 group-hover:scale-110 transition duration-300">
                            <CheckCircle className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Completed Rides</p>
                            <h3 className="text-4xl font-black text-[#4a3224]">{stats.completed}</h3>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 group-hover:scale-110 transition duration-300">
                             <CheckCircle className="h-24 w-24" />
                        </div>
                    </div>
                    <div className="card-brown p-8 flex items-center gap-6 border-l-[6px] border-l-red-500 shadow-lg relative overflow-hidden group">
                        <div className="bg-red-50 p-4 rounded-2xl text-red-500 group-hover:scale-110 transition duration-300">
                            <XCircle className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Cancelled</p>
                            <h3 className="text-4xl font-black text-[#4a3224]">{stats.cancelled}</h3>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 group-hover:scale-110 transition duration-300">
                             <XCircle className="h-24 w-24" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sticky top-24">
                    
                    {/* Recent Activity */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-[#4a3224]">Recent Bookings</h2>
                            <Link to="/my-bookings" className="text-sm font-bold text-[#8b5e3c] flex items-center hover:underline">
                                See All <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                        </div>
                        
                        {recentBookings.length > 0 ? (
                            <div className="space-y-6">
                                {recentBookings.map((booking, idx) => (
                                    <div key={idx} className="bg-white border border-[#e2d5c3] p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 relative group overflow-hidden">
                                        <div className="h-24 w-40 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-transparent group-hover:border-[#8b5e3c] transition duration-300">
                                            <img src={booking.bikeId?.images?.[0] || 'https://via.placeholder.com/200?text=Bike'} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-lg text-[#4a3224]">{booking.bikeId?.brand} {booking.bikeId?.model}</h4>
                                                    <p className="text-xs text-gray-500 flex items-center mt-1">
                                                        <Calendar className="h-3 w-3 mr-1" />
                                                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs text-gray-400 block mb-1">Amount</span>
                                                    <p className="text-lg font-black text-[#8b5e3c]">₹{booking.totalAmount}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-end mt-4 pt-4 border-t border-[#fdfaf6]">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                                    booking.bookingStatus === 'completed' ? 'bg-green-100 text-green-700' :
                                                    booking.bookingStatus === 'active' ? 'bg-blue-100 text-blue-700' :
                                                    booking.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {booking.bookingStatus}
                                                </span>
                                                <Link to="/my-bookings" className="text-xs font-bold text-[#8b5e3c] opacity-0 group-hover:opacity-100 transition flex items-center">
                                                    Manage <ArrowRight className="h-3 w-3 ml-1" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white border-2 border-dashed border-[#e2d5c3] p-16 rounded-3xl text-center space-y-4 shadow-inner">
                                <div className="h-20 w-20 bg-[#fdfaf6] rounded-full flex items-center justify-center mx-auto">
                                     <Bike className="h-10 w-10 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-[#4a3224]">No bookings yet</h3>
                                <p className="text-gray-500 text-sm max-w-xs mx-auto">Ready to hit the road? Explore our premium bikes and make your first booking.</p>
                                <Link to="/browse" className="btn-brown py-3 px-8 text-sm inline-flex items-center">
                                    Browse Bikes <PlusCircle className="h-4 w-4 ml-2" />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white border border-[#e2d5c3] p-8 rounded-3xl shadow-lg border-t-[6px] border-t-[#8b5e3c]">
                            <h3 className="text-xl font-black text-[#4a3224] mb-8 flex items-center">
                                <PlusCircle className="h-5 w-5 mr-3 text-[#8b5e3c]" /> Quick Actions
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <Link to="/browse" className="flex items-center p-4 bg-[#fdfaf6] rounded-2xl hover:bg-[#8b5e3c] group hover:text-white transition-all transform hover:-translate-y-1 shadow-sm font-bold">
                                    <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4 group-hover:bg-[#fdfaf6] transition duration-300">
                                        <Bike className="h-5 w-5 text-[#8b5e3c]" />
                                    </div>
                                    Rent a Bike
                                </Link>
                                <Link to="/profile" className="flex items-center p-4 bg-[#fdfaf6] rounded-2xl hover:bg-[#8b5e3c] group hover:text-white transition-all transform hover:-translate-y-1 shadow-sm font-bold">
                                    <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4 group-hover:bg-[#fdfaf6] transition duration-300">
                                        <Settings className="h-5 w-5 text-[#8b5e3c]" />
                                    </div>
                                    Account Settings
                                </Link>
                                <Link to="/my-bookings" className="flex items-center p-4 bg-[#fdfaf6] rounded-2xl hover:bg-[#8b5e3c] group hover:text-white transition-all transform hover:-translate-y-1 shadow-sm font-bold">
                                    <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4 group-hover:bg-[#fdfaf6] transition duration-300">
                                        <Clock className="h-5 w-5 text-[#8b5e3c]" />
                                    </div>
                                    Booking History
                                </Link>
                            </div>
                        </div>

                        <div className="bg-[#fffcf3] p-6 rounded-3xl border border-yellow-100 flex gap-4">
                             <div className="h-12 w-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow text-white flex-shrink-0">
                                <User className="h-6 w-6" />
                             </div>
                             <div>
                                 <h4 className="font-bold text-[#4a3224]">Profile Status</h4>
                                 <p className="text-xs text-[#8b5e3c] mt-1 font-semibold flex items-center">Verified Account <CheckCircle className="h-3 w-3 ml-1" /></p>
                             </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default UserDashboard;

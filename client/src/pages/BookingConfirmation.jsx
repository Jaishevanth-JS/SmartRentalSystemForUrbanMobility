import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, MapPin, Calendar, ArrowRight, Home, CreditCard, ShieldCheck, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

const BookingConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [bike, setBike] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const loadConfirmationData = async () => {
            // SOURCE 1: React Router location.state (primary)
            let bookingData = location.state?.booking;
            let bikeData = location.state?.bike;

            // SOURCE 2: sessionStorage fallback
            if (!bookingData || !bikeData) {
                try {
                    const stored = sessionStorage.getItem('lastBookingConfirmation');
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        bookingData = parsed.booking || bookingData;
                        bikeData = parsed.bike || bikeData;
                    }
                } catch (e) {
                    console.error('sessionStorage parse error:', e);
                }
            }

            // SOURCE 3: Fetch from API as last resort
            if (bookingData && !bikeData && bookingData.bikeId) {
                try {
                    const bikeRes = await API.get(`/bikes/${typeof bookingData.bikeId === 'string' ? bookingData.bikeId : bookingData.bikeId._id || bookingData.bikeId}`);
                    bikeData = bikeRes.data?.bike || bikeRes.data;
                } catch (e) {
                    console.error('Failed to fetch bike details:', e);
                }
            }

            if (!isMounted) return;

            // If we have both pieces of data, render the receipt
            if (bookingData) {
                setBooking(bookingData);
                setBike(bikeData || {});
                setLoading(false);
                // Clean up sessionStorage after successful read
                sessionStorage.removeItem('lastBookingConfirmation');
            } else {
                // No data anywhere — redirect
                setError('No booking data found.');
                setLoading(false);
                toast.error('Booking details not found. Showing your bookings instead.');
                setTimeout(() => {
                    if (isMounted) navigate('/my-bookings', { replace: true });
                }, 2000);
            }
        };

        loadConfirmationData();

        return () => { isMounted = false; };
    }, [location.state, navigate]);

    // Loading state — always show full page shell (never white screen)
    if (loading) {
        return (
            <div className="min-h-screen bg-[#fdfaf6] flex flex-col">
                <Navbar />
                <main className="flex-grow flex items-center justify-center py-20 px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5e3c] mx-auto mb-4"></div>
                        <p className="text-gray-400 font-bold text-sm">Loading confirmation details...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Error state — show error with full page shell
    if (error || !booking) {
        return (
            <div className="min-h-screen bg-[#fdfaf6] flex flex-col">
                <Navbar />
                <main className="flex-grow flex items-center justify-center py-20 px-4">
                    <div className="text-center max-w-md">
                        <div className="h-20 w-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="h-10 w-10 text-yellow-500" />
                        </div>
                        <h2 className="text-2xl font-black text-[#4a3224] mb-3">Booking Not Found</h2>
                        <p className="text-gray-500 mb-8">Redirecting you to your bookings page...</p>
                        <Link to="/my-bookings" className="btn-brown py-3 px-10 text-sm inline-flex items-center shadow-lg">
                            Go to My Bookings <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Successfully loaded — render the receipt
    const bookingId = booking._id || booking.id || '00000000';
    const shortId = typeof bookingId === 'string' ? bookingId.slice(-8) : '********';
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    return (
        <div className="min-h-screen bg-[#fdfaf6] flex flex-col animate-fadeIn">
            <Navbar />
            
            <main className="flex-grow flex items-center justify-center py-20 px-4">
                <div className="max-w-xl w-full bg-white rounded-[32px] p-12 shadow-2xl border border-[#e2d5c3] text-center border-t-[12px] border-t-[#8b5e3c]">
                    <div className="bg-green-100 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ring-8 ring-green-50">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    
                    <h1 className="text-4xl font-black text-[#4a3224] mb-3 leading-tight">Booking Confirmed!</h1>
                    <p className="text-[#8b5e3c] mb-10 text-lg font-bold">Your ride is ready for adventure.</p>

                    <div className="bg-[#f0ede6] p-8 rounded-[24px] mb-10 text-left border border-[#e2d5c3] space-y-8 shadow-inner relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                           <ShieldCheck size={80} />
                        </div>
                        
                        <div className="flex justify-between items-center pb-6 border-b border-[#e2d5c3]">
                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Reservation ID</h4>
                                <p className="text-sm font-black text-[#4a3224] uppercase bg-white px-2 py-1 rounded border border-[#e2d5c3]">#{shortId}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 text-right">Payment Status</h4>
                                <p className="text-[11px] bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-black uppercase tracking-wider shadow-sm">Paid</p>
                            </div>
                        </div>

                        {bike && bike.brand && (
                            <div className="flex gap-5 items-center">
                                <div className="h-20 w-32 rounded-xl overflow-hidden bg-white border border-[#e2d5c3] flex-shrink-0 shadow-sm">
                                    <img src={bike.images?.[0] || 'https://via.placeholder.com/400?text=Bike'} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-black text-xl text-[#4a3224] leading-none mb-1">{bike.brand} {bike.model}</h4>
                                    <div className="flex items-center text-[10px] font-black uppercase text-gray-400 mt-2">
                                        <MapPin className="h-3 w-3 mr-1 text-[#8b5e3c]" /> {bike.city}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-10 pt-6 border-t border-[#e2d5c3]">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="h-4 w-4 text-[#8b5e3c]" />
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rent Period</h4>
                                </div>
                                <p className="text-xs font-black text-[#4a3224] leading-relaxed">
                                    {startDate.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} <br/>
                                    <span className="text-[#8b5e3c] uppercase text-[10px]">
                                        @{startDate.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                    </span>
                                    <br/><span className="text-gray-300 mx-2 text-[10px]">to</span><br/>
                                    {endDate.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}<br/>
                                    <span className="text-[#8b5e3c] uppercase text-[10px]">
                                        @{endDate.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <CreditCard className="h-4 w-4 text-[#8b5e3c]" />
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Paid</h4>
                                </div>
                                <p className="text-3xl font-black text-[#8b5e3c]">₹{booking.totalAmount}</p>
                                <p className="text-[9px] text-gray-400 uppercase font-bold mt-1 tracking-widest">Includes all taxes</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link to="/my-bookings" className="w-full h-14 bg-[#8b5e3c] text-white flex items-center justify-center rounded-2xl font-black hover:bg-[#6f4b30] shadow-lg transition-all group">
                            Check My Rides
                            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/" className="w-full h-14 border-2 border-[#8b5e3c] text-[#8b5e3c] flex items-center justify-center rounded-2xl font-black hover:bg-[#8b5e3c] hover:text-white transition-all">
                            <Home className="h-5 w-5 mr-2" />
                            To Homepage
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BookingConfirmation;

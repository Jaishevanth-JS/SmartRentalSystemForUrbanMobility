import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, MapPin, Calendar, Clock, ArrowRight, Home, CreditCard } from 'lucide-react';

const BookingConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { booking, bike } = location.state || {};

    useEffect(() => {
        if (!booking || !bike) {
            navigate('/my-bookings');
        }
    }, [booking, bike, navigate]);

    if (!booking) return null;

    return (
        <div className="min-h-screen bg-[#fdfaf6] flex flex-col">
            <Navbar />
            
            <main className="flex-grow flex items-center justify-center py-20 px-4">
                <div className="max-w-xl w-full bg-white rounded-3xl p-10 shadow-2xl border border-[#e2d5c3] text-center border-t-[10px] border-t-[#8b5e3c]">
                    <div className="bg-green-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    
                    <h1 className="text-3xl font-black text-[#4a3224] mb-4">Ride Confirmed!</h1>
                    <p className="text-[#8b5e3c] mb-10 text-lg">Your booking was successful and your bike is waiting.</p>

                    <div className="bg-[#fdfaf6] p-8 rounded-2xl mb-10 text-left border border-[#e2d5c3] space-y-6">
                        <div className="flex justify-between items-center pb-6 border-b border-[#e2d5c3]">
                            <div>
                                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Booking ID</h4>
                                <p className="text-sm font-bold text-[#4a3224] uppercase">#{booking._id.slice(-8)}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Status</h4>
                                <p className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Paid</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="h-20 w-32 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                                <img src={bike.images?.[0] || 'https://via.placeholder.com/200?text=Bike'} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <h4 className="font-bold text-lg text-[#4a3224]">{bike.brand} {bike.model}</h4>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <MapPin className="h-3 w-3 mr-1" /> {bike.city}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 pt-4 border-t border-[#e2d5c3]">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="h-4 w-4 text-[#8b5e3c]" />
                                    <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Rental Period</h4>
                                </div>
                                <p className="text-sm font-bold text-[#4a3224]">
                                    {new Date(booking.startDate).toLocaleDateString()} <br /> to <br /> {new Date(booking.endDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <CreditCard className="h-4 w-4 text-[#8b5e3c]" />
                                    <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Payment Amount</h4>
                                </div>
                                <p className="text-2xl font-black text-[#8b5e3c]">₹{booking.totalAmount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Link to="/my-bookings" className="w-full btn-brown flex items-center justify-center py-4 text-md font-bold shadow-lg">
                            Track My Bookings
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                        <Link to="/" className="w-full btn-outline-brown flex items-center justify-center py-4 text-md font-bold">
                            <Home className="h-4 w-4 mr-2" />
                            Return Home
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BookingConfirmation;

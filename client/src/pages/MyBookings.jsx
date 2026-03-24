import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, MapPin, Star, MessageSquare, XCircle, Clock, CheckCircle, Package, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

const ReviewModal = ({ isOpen, onClose, booking, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ bikeId: booking.bikeId._id, bookingId: booking._id, rating, comment });
      onClose();
    } catch (err) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-[#e2d5c3] relative animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition">
            <XCircle className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-black text-[#4a3224] mb-2 flex items-center">
            <Star className="h-6 w-6 mr-3 text-[#8b5e3c] fill-current" />
            Rate Your Ride
        </h2>
        <p className="text-[#8b5e3c] mb-8 font-medium">How was your experience riding the {booking.bikeId?.brand} {booking.bikeId?.model}?</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4 block text-center">Select Rating</label>
            <div className="flex justify-center gap-4 text-[#e2d5c3]">
              {[1, 2, 3, 4, 5].map(i => (
                <button 
                  key={i} 
                  type="button" 
                  onClick={() => setRating(i)}
                  className={`transition-all transform hover:scale-125 ${i <= rating ? 'text-yellow-500 scale-110 drop-shadow-lg' : ''}`}
                >
                  <Star className="h-10 w-10 fill-current" />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Tell us more</label>
            <textarea 
              rows="4" 
              className="w-full px-5 py-4 bg-[#fdfaf6] border border-[#e2d5c3] rounded-2xl focus:outline-none focus:border-[#8b5e3c] placeholder:text-gray-300 text-sm font-medium"
              placeholder="What did you like? Any feedback for the owner?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            disabled={submitting}
            className="w-full btn-brown py-4 text-lg font-bold flex items-center justify-center shadow-lg transform active:scale-95 transition-all"
          >
            {submitting ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [reviewBooking, setReviewBooking] = useState(null);

    const fetchBookings = useCallback(async (showLoader = true) => {
        if (showLoader) setLoading(true);
        setError(null);
        try {
            const res = await API.get('/bookings/my-bookings');
            setBookings(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
            setError('Could not load your bookings. Please try again.');
            if (showLoader) toast.error('Failed to load bookings');
        } finally {
            if (showLoader) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await API.put(`/bookings/${id}/cancel`);
            toast.success('Booking cancelled successfully');
            await fetchBookings(false);
        } catch (err) {
            toast.error('Failed to cancel booking');
        }
    };

    const handleReviewSubmit = async (reviewData) => {
        try {
            await API.post('/reviews', reviewData);
            // 1. Show success toast notification saying Review submitted successfully
            toast.success('Review submitted successfully');
            // 2. Close the review modal
            setReviewBooking(null);
            // 3. Immed refetch bookings state silently to update UI without unmounting
            await fetchBookings(false);
        } catch (err) {
            console.error('Submit review error:', err);
            throw err;
        }
    };

    const filteredBookings = bookings.filter(b => {
        if (activeTab === 'upcoming') return b.bookingStatus === 'upcoming';
        if (activeTab === 'active') return b.bookingStatus === 'active';
        if (activeTab === 'completed') return b.bookingStatus === 'completed';
        if (activeTab === 'cancelled') return b.bookingStatus === 'cancelled';
        return true;
    });

    // Count per tab for badges
    const counts = {
        upcoming: bookings.filter(b => b.bookingStatus === 'upcoming').length,
        active: bookings.filter(b => b.bookingStatus === 'active').length,
        completed: bookings.filter(b => b.bookingStatus === 'completed').length,
        cancelled: bookings.filter(b => b.bookingStatus === 'cancelled').length,
    };

    return (
        <div className="min-h-screen bg-[#fdfaf6] flex flex-col">
            <Navbar />
            
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-[#4a3224]">My Bookings</h1>
                        <p className="text-[#8b5e3c] mt-1 font-medium italic">Track your past and future rides on two wheels.</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto gap-4 mb-10 border-b border-[#e2d5c3] pb-1 scrollbar-hide">
                    {['upcoming', 'active', 'completed', 'cancelled'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-4 text-sm font-extrabold uppercase tracking-widest whitespace-nowrap transition-all border-b-4 flex items-center gap-2 ${activeTab === tab ? 'border-[#8b5e3c] text-[#8b5e3c] bg-[#8b5e3c]/5 rounded-t-xl' : 'border-transparent text-gray-400 hover:text-[#8b5e3c]'}`}
                        >
                            {tab}
                            {counts[tab] > 0 && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === tab ? 'bg-[#8b5e3c] text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {counts[tab]}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* CONTENT AREA */}
                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5e3c] mx-auto mb-4"></div>
                            <p className="text-gray-400 font-bold text-sm">Loading your bookings...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-white border-2 border-dashed border-red-200 p-16 rounded-3xl text-center shadow-inner">
                        <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="h-12 w-12 text-red-400" />
                        </div>
                        <h3 className="text-2xl font-black text-[#4a3224] mb-2">Something went wrong</h3>
                        <p className="text-gray-500 mb-8">{error}</p>
                        <button onClick={fetchBookings} className="btn-brown py-3 px-10 text-sm inline-flex items-center shadow-lg">
                            Retry
                        </button>
                    </div>
                ) : filteredBookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredBookings.map((booking) => (
                            <div key={booking._id} className="bg-white border border-[#e2d5c3] rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-4">
                                     <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center shadow-sm ${
                                        booking.bookingStatus === 'completed' ? 'bg-green-100 text-green-700' :
                                        booking.bookingStatus === 'active' ? 'bg-blue-100 text-blue-700' :
                                        booking.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {booking.bookingStatus}
                                    </span>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-6">
                                    <div className="h-32 w-52 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-[#fdfaf6]">
                                        <img src={booking.bikeId?.images?.[0] || 'https://via.placeholder.com/200?text=Bike'} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h3 className="text-xl font-black text-[#4a3224]">{booking.bikeId?.brand} {booking.bikeId?.model}</h3>
                                            <div className="flex items-center text-xs text-gray-500 mt-1 font-bold">
                                                <MapPin className="h-3 w-3 mr-1 text-[#8b5e3c]" /> {booking.bikeId?.city}
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rental Period</p>
                                                <div className="flex items-center text-xs font-bold text-[#4a3224]">
                                                    <Calendar className="h-3 w-3 mr-2 text-[#8b5e3c]" />
                                                    {new Date(booking.startDate).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })} - {new Date(booking.endDate).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                                                </div>
                                            </div>
                                            <div className="space-y-1 text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount Paid</p>
                                                <p className="text-xl font-black text-[#8b5e3c]">₹{booking.totalAmount}</p>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-[#fdfaf6] flex flex-wrap gap-4">
                                            {booking.bookingStatus === 'upcoming' && (
                                                <button 
                                                    onClick={() => handleCancel(booking._id)}
                                                    className="flex-1 bg-white border-2 border-red-500 text-red-500 px-6 py-2.5 rounded-xl text-xs font-black uppercase hover:bg-red-50 transition tracking-widest flex items-center justify-center"
                                                >
                                                    <XCircle className="h-4 w-4 mr-2" /> Cancel
                                                </button>
                                            )}
                                            {booking.bookingStatus === 'completed' && !booking.hasReview && (
                                                <button 
                                                    onClick={() => setReviewBooking(booking)}
                                                    className="flex-1 btn-brown px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center"
                                                >
                                                    <MessageSquare className="h-4 w-4 mr-2" /> Leave Review
                                                </button>
                                            )}
                                            {booking.bikeId?._id && (
                                                <Link to={`/bikes/${booking.bikeId._id}`} className="flex-1 btn-outline-brown px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center">
                                                     <Package className="h-4 w-4 mr-2" /> View Bike
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border-2 border-dashed border-[#e2d5c3] p-16 rounded-3xl text-center shadow-inner">
                        <div className="h-24 w-24 bg-[#fdfaf6] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock className="h-12 w-12 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-black text-[#4a3224]">No {activeTab} bookings</h3>
                        <p className="text-[#8b5e3c] mb-8 font-medium italic">Looks like you haven't made any bookings in this category yet.</p>
                        <Link to="/browse" className="btn-brown py-4 px-10 text-sm inline-flex items-center shadow-lg">
                            Explore Available Bikes
                        </Link>
                    </div>
                )}
            </main>

            {reviewBooking && (
                <ReviewModal 
                    isOpen={!!reviewBooking} 
                    onClose={() => setReviewBooking(null)} 
                    booking={reviewBooking}
                    onSubmit={handleReviewSubmit}
                />
            )}

            <Footer />
        </div>
    );
};

export default MyBookings;

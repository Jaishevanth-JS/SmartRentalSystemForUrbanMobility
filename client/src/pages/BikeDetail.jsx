import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import { MapPin, Star, Calendar, ShieldCheck, CheckCircle, Info, Zap, Fuel, Activity, Palette, AlertCircle } from 'lucide-react';

/* ── inline toast (no library) ── */
const Toast = ({ msg, type, onClose }) => {
  if (!msg) return null;
  const bg = type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6';
  return (
    <div style={{ position: 'fixed', bottom: 32, right: 32, background: bg, color: '#fff', padding: '14px 24px', borderRadius: 12, fontWeight: 700, fontSize: 15, zIndex: 9999, boxShadow: '0 4px 24px rgba(0,0,0,.18)', display: 'flex', alignItems: 'center', gap: 10, maxWidth: 360 }}>
      {msg}
      <button onClick={onClose} style={{ marginLeft: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 18 }}>×</button>
    </div>
  );
};

const BikeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ bike: null, reviews: [] });
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [toast, setToast] = useState({ msg: '', type: '' });

  const [bookingDates, setBookingDates] = useState({ startDate: '', endDate: '' });
  const [dateErrors, setDateErrors] = useState({ startDate: '', endDate: '' });

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3500);
  };

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const res = await API.get(`/bikes/${id}`);
        setData(res.data);
      } catch (err) {
        showToast('Bike not found', 'error');
        navigate('/browse');
      } finally {
        setLoading(false);
      }
    };
    fetchBike();
  }, [id, navigate]);

  const calculateTotal = () => {
    if (!bookingDates.startDate || !bookingDates.endDate || !data.bike) return 0;
    const start = new Date(bookingDates.startDate);
    const end = new Date(bookingDates.endDate);
    if (end <= start) return 0;
    const diffTime = Math.abs(end - start);
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    return diffDays * data.bike.pricePerDay;
  };

  const today = new Date().toISOString().split('T')[0];

  const handleDateChange = (field, value) => {
    setBookingDates((prev) => ({ ...prev, [field]: value }));
    setDateErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleBookNow = () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        showToast('Please login to book a bike', 'info');
        navigate('/login');
        return;
      }

      // Inline validation
      const errors = { startDate: '', endDate: '' };
      let hasError = false;

      if (!bookingDates.startDate) {
        errors.startDate = 'Please select a start date';
        hasError = true;
      }
      if (!bookingDates.endDate) {
        errors.endDate = 'Please select an end date';
        hasError = true;
      }
      if (bookingDates.startDate && bookingDates.endDate) {
        const start = new Date(bookingDates.startDate);
        const end = new Date(bookingDates.endDate);
        if (end <= start) {
          errors.endDate = 'End date must be after start date';
          hasError = true;
        }
      }

      setDateErrors(errors);
      if (hasError) return;

      const total = calculateTotal();
      if (total <= 0) {
        setDateErrors((prev) => ({ ...prev, endDate: 'Please choose valid dates to calculate total' }));
        return;
      }

      navigate('/payment', {
        state: {
          bike: data.bike,
          dates: bookingDates,
          totalAmount: total
        }
      });
    } catch (err) {
      showToast('Something went wrong. Please try again.', 'error');
    }
  };

  if (loading) return <Spinner />;
  if (!data.bike) return null;

  const { bike, reviews } = data;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 'New';
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-[#fdfaf6] flex flex-col">
      <Navbar />
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: '' })} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left: Images & Info */}
          <div className="lg:col-span-8 space-y-10">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="h-[400px] md:h-[500px] rounded-3xl overflow-hidden border border-[#e2d5c3] bg-white shadow-sm transition hover:shadow-md">
                <img
                  src={bike.images?.[selectedImg] || 'https://via.placeholder.com/800?text=Bike'}
                  alt={bike.model}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800?text=No+Image'; }}
                />
              </div>
              {bike.images?.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {bike.images.map((img, idx) => (
                    <button key={idx} onClick={() => setSelectedImg(idx)}
                      className={`flex-shrink-0 h-20 w-32 rounded-xl overflow-hidden border-2 transition ${selectedImg === idx ? 'border-[#8b5e3c]' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Main Info */}
            <div className="bg-white rounded-3xl p-8 border border-[#e2d5c3] shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-[#4a3224]">{bike.brand} {bike.model}</h1>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center bg-[#fdfaf6] px-3 py-1 rounded-full border border-[#e2d5c3]">
                      <MapPin className="h-4 w-4 mr-1 text-[#8b5e3c]" /> {bike.city}
                    </span>
                    <span className="flex items-center bg-[#fdfaf6] px-3 py-1 rounded-full border border-[#e2d5c3]">
                      <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" /> {avgRating} ({reviews.length} reviews)
                    </span>
                    <span className="flex items-center bg-[#fdfaf6] px-3 py-1 rounded-full border border-[#e2d5c3]">
                      <Zap className="h-4 w-4 mr-1 text-blue-500" /> {bike.bikeType || 'Standard'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#8b5e3c] block">Rental Rate</span>
                  <span className="text-3xl font-extrabold text-[#4a3224]">₹{bike.pricePerDay}</span>
                  <span className="text-sm text-gray-400"> / day</span>
                </div>
              </div>

              <div className="border-t border-[#e2d5c3] pt-8">
                <h3 className="text-lg font-bold text-[#4a3224] mb-6 flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-2 text-[#8b5e3c]" /> Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                  {[
                    { icon: <Calendar className="h-6 w-6" />, label: 'Year', value: bike.year },
                    { icon: <Activity className="h-6 w-6" />, label: 'Engine', value: `${bike.cc} CC` },
                    { icon: <Fuel className="h-6 w-6" />, label: 'Fuel', value: bike.fuelType || 'Petrol' },
                    { icon: <Palette className="h-6 w-6" />, label: 'Color', value: bike.color || 'Any' },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="text-center p-4 rounded-2xl bg-[#fdfaf6] border border-transparent hover:border-[#8b5e3c] transition">
                      <div className="text-[#8b5e3c] mx-auto mb-2 flex justify-center">{icon}</div>
                      <p className="text-xs text-gray-500 uppercase font-bold">{label}</p>
                      <p className="font-bold text-[#4a3224] capitalize">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-3xl p-8 border border-[#e2d5c3] shadow-sm">
              <h3 className="text-xl font-bold text-[#4a3224] mb-8 flex items-center justify-between">
                Reviews
                <span className="text-sm font-normal text-gray-500">{reviews.length} Total</span>
              </h3>
              {reviews.length > 0 ? (
                <div className="space-y-8">
                  {reviews.map((rev, idx) => (
                    <div key={idx} className="flex gap-4 pb-8 border-b border-[#fdfaf6] last:border-0 last:pb-0">
                      <div className="h-12 w-12 rounded-full bg-[#8b5e3c]/10 text-[#8b5e3c] flex items-center justify-center font-bold flex-shrink-0 text-lg border border-[#8b5e3c]/20">
                        {rev.userId?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold text-[#4a3224]">{rev.userId?.name}</h4>
                          <div className="flex text-yellow-500 text-xs">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-current' : 'text-gray-200'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">{new Date(rev.createdAt).toLocaleDateString()}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">{rev.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center bg-[#fdfaf6] rounded-2xl border-2 border-dashed border-[#e2d5c3]">
                  <p className="text-gray-400">No reviews yet for this bike.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Booking Card & Owner */}
          <div className="lg:col-span-4 space-y-6">
            {/* Booking Form */}
            <div className="bg-white rounded-3xl p-8 border border-[#e2d5c3] shadow-lg sticky top-24">
              <h3 className="text-xl font-bold text-[#4a3224] mb-6">Booking Details</h3>
              <div className="space-y-5">

                {/* Start Date */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Start Date</label>
                  <input
                    type="date"
                    min={today}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#8b5e3c] bg-[#fdfaf6] ${dateErrors.startDate ? 'border-red-400' : 'border-[#e2d5c3]'}`}
                    value={bookingDates.startDate}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                  />
                  {dateErrors.startDate && (
                    <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {dateErrors.startDate}
                    </p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">End Date</label>
                  <input
                    type="date"
                    min={bookingDates.startDate || today}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#8b5e3c] bg-[#fdfaf6] ${dateErrors.endDate ? 'border-red-400' : 'border-[#e2d5c3]'}`}
                    value={bookingDates.endDate}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                  />
                  {dateErrors.endDate && (
                    <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {dateErrors.endDate}
                    </p>
                  )}
                </div>

                {/* Price Summary */}
                {total > 0 && (
                  <div className="bg-[#f0ede6] p-4 rounded-2xl space-y-2 border border-[#e2d5c3]/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        ₹{bike.pricePerDay} × {Math.max(1, Math.ceil(Math.abs(new Date(bookingDates.endDate) - new Date(bookingDates.startDate)) / (1000 * 60 * 60 * 24)))} days
                      </span>
                      <span className="font-bold text-[#4a3224]">₹{total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Service Fee</span>
                      <span className="font-bold text-[#4a3224]">₹0</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                      <span className="font-bold text-[#4a3224]">Total Amount</span>
                      <span className="text-xl font-extrabold text-[#8b5e3c]">₹{total}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBookNow}
                  className="w-full py-4 bg-[#8b5e3c] text-white rounded-2xl text-lg font-bold shadow-md hover:bg-[#6f4b30] hover:shadow-lg active:scale-95 transition-all"
                >
                  Book This Bike
                </button>
                <p className="text-[11px] text-gray-400 text-center">You won't be charged yet</p>
              </div>
            </div>

            {/* Owner Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#e2d5c3] shadow-sm">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Hosted by</h4>
              <div className="flex items-center">
                <div className="h-14 w-14 rounded-full bg-[#8b5e3c] text-white flex items-center justify-center font-bold text-xl mr-4 border-2 border-[#fdfaf6] shadow">
                  {bike.ownerId?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <h4 className="font-bold text-[#4a3224] text-lg">{bike.ownerId?.name}</h4>
                  <p className="text-xs text-gray-500">
                    Reliable Host since {bike.ownerId?.createdAt ? new Date(bike.ownerId.createdAt).getFullYear() : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Note box */}
            <div className="bg-[#fff9f0] border border-yellow-100 rounded-3xl p-6 flex gap-4">
              <Info className="h-6 w-6 text-yellow-600 flex-shrink-0" />
              <p className="text-xs text-yellow-800 leading-relaxed">
                Ensure you bring a valid driver's license and identification. All rentals include standard helmet. Ride safe!
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BikeDetail;

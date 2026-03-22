import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import { CreditCard, CheckCircle, ShieldCheck, MapPin, Calendar, Info } from 'lucide-react';
import { toast } from 'react-toastify';

// Load Stripe from .env variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ bike, dates, totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorStatus(null);
    
    // Timeout promise (30 seconds)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Payment timed out. Please check your connection.')), 30000)
    );

    try {
      // 1. Create Payment Intent
      const result = await Promise.race([
        (async () => {
           const { data } = await API.post('/payment/create-payment-intent', { totalAmount });
           
           // 2. Confirm Payment
           return await stripe.confirmCardPayment(data.clientSecret, {
             payment_method: {
               card: elements.getElement(CardElement),
             },
           });
        })(),
        timeoutPromise
      ]);

      if (result.error) {
        toast.error(result.error.message);
        setErrorStatus('Payment failed. Please try again');
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // 3. Create Booking
          const bookingData = {
            bikeId: bike._id,
            startDate: dates.startDate,
            endDate: dates.endDate,
            paymentIntentId: result.paymentIntent.id
          };
          const res = await API.post('/bookings', bookingData);
          toast.success('Payment successful! Booking confirmed.');
          navigate('/booking-confirmation', { state: { booking: res.data, bike } });
        }
      }
    } catch (err) {
      console.error('Payment Flow Error:', err);
      const msg = err.message || 'Payment processing failed';
      toast.error(msg);
      setErrorStatus('Payment failed. Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#fdfaf6] p-6 rounded-2xl border border-[#e2d5c3] shadow-inner mb-6">
        <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4 block">Card Details</label>
        <div className="p-4 bg-white rounded-xl border border-[#e2d5c3]">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#4a3224',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#9e2146' },
            },
          }} />
        </div>
      </div>

      <div className="bg-[#f0ede6] p-6 rounded-2xl space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Billed Amount</span>
          <span className="text-2xl font-black text-[#8b5e3c]">₹{totalAmount}</span>
        </div>
        <p className="text-[10px] text-gray-400 leading-tight">By clicking "Pay Now", you authorize BikeRental to charge your card for the total amount shown above.</p>
      </div>

      <button
        disabled={!stripe || loading}
        className="w-full btn-brown py-4 text-lg font-bold flex items-center justify-center shadow-lg transform active:scale-95 transition-all"
      >
        {loading ? <Spinner /> : errorStatus ? errorStatus : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Proceed & Pay Now
          </>
        )}
      </button>
      
      <div className="flex items-center justify-center gap-4 text-gray-400 text-xs mt-4">
        <span className="flex items-center"><ShieldCheck className="h-3 w-3 mr-1" /> Secure 256-bit SSL</span>
        <span className="flex items-center"><CheckCircle className="h-3 w-3 mr-1" /> PCI Compliant</span>
      </div>
    </form>
  );
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bike, dates, totalAmount } = location.state || {};

  useEffect(() => {
    if (!bike || !dates || !totalAmount) {
      toast.error('Invalid booking session');
      navigate('/browse');
    }
  }, [bike, dates, totalAmount, navigate]);

  if (!bike) return null;

  return (
    <div className="min-h-screen bg-[#fdfaf6] flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-[#4a3224]">Checkout & Payment</h1>
            <p className="text-[#8b5e3c] mt-2">Almost there! Your ride is just a step away.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-[#e2d5c3] shadow-md border-t-[6px] border-t-[#8b5e3c]">
              <h3 className="text-xl font-bold text-[#4a3224] mb-6 flex items-center">
                <Info className="h-5 w-5 mr-2 text-[#8b5e3c]" /> Booking Summary
              </h3>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-center">
                  <div className="h-16 w-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                    <img src={bike.images?.[0] || 'https://via.placeholder.com/200?text=Bike'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#4a3224]">{bike.brand} {bike.model}</h4>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MapPin className="h-3 w-3 mr-1" /> {bike.city}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-6 border-y border-[#fdfaf6]">
                    <div>
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Pick Up</p>
                        <p className="text-sm font-bold text-[#4a3224] flex items-center">
                            <Calendar className="h-3 w-3 mr-2 text-[#8b5e3c]" />
                            {new Date(dates.startDate).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Drop Off</p>
                        <p className="text-sm font-bold text-[#4a3224] flex items-center">
                            <Calendar className="h-3 w-3 mr-2 text-[#8b5e3c]" />
                            {new Date(dates.endDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duration</span>
                        <span className="font-bold text-[#4a3224]">{Math.max(1, Math.ceil(Math.abs(new Date(dates.endDate) - new Date(dates.startDate)) / (1000 * 60 * 60 * 24)))} Days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Rent (per day × duration)</span>
                        <span className="font-bold text-[#4a3224]">₹{totalAmount}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                        <span className="font-extrabold text-[#4a3224]">Payable Amount</span>
                        <span className="text-xl font-black text-[#8b5e3c]">₹{totalAmount}</span>
                    </div>
                </div>
              </div>
            </div>

            <div className="bg-[#fffcf3] p-4 rounded-2xl border border-yellow-100 flex gap-3">
                <CheckCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                <p className="text-xs text-yellow-800 italic">Free cancellation up to 24 hours before your ride starts.</p>
            </div>
          </div>

          {/* Payment Element */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-[#e2d5c3] shadow-lg">
            <h3 className="text-xl font-black text-[#4a3224] mb-8 flex items-center">
              <CreditCard className="h-6 w-6 mr-3 text-[#8b5e3c]" /> Payment Details
            </h3>
            
            <Elements stripe={stripePromise}>
              <CheckoutForm bike={bike} dates={dates} totalAmount={totalAmount} />
            </Elements>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Payment;

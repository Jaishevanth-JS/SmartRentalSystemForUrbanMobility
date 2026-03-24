import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import { CreditCard, CheckCircle, ShieldCheck, MapPin, Calendar, Info, AlertCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const CheckoutForm = ({ bike, dates, totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState(null);
  const [stripeError, setStripeError] = useState(null);
  const navigatedRef = useRef(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Check if Stripe and Elements are loaded
    if (!stripe || !elements) {
      toast.error('Payment system is initializing. Please wait.');
      return;
    }

    setLoading(true);
    setStripeError(null);
    setProcessingStatus('Verifying bike availability...');

    try {
      // --- STEP 0: PRE-CHECK AVAILABILITY (Issue 2) ---
      // We check this here to prevent charging the user for an already booked slot
      const availabilityRes = await API.post('/bookings/check-availability', {
        bikeId: bike._id,
        startDate: dates.startDate,
        endDate: dates.endDate
      });

      if (!availabilityRes.data?.available) {
        throw new Error('This bike was just booked by someone else for this time slot. Please choose another time.');
      }

      setProcessingStatus('Setting up secure payment...');

      // --- STEP 1: CREATE PAYMENT INTENT ---
      const intentRes = await API.post('/payment/create-payment-intent', { totalAmount });
      const clientSecret = intentRes.data?.clientSecret;

      if (!clientSecret) {
        throw new Error('Could not establish a secure checkout connection.');
      }

      setProcessingStatus('Authorizing card with bank...');

      // --- STEP 2: STRIPE CONFIRMATION (Issue 1 Fix: Ensure no race/timeouts crash) ---
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      // 3. Handle result properly
      if (result.error) {
        setStripeError(result.error.message);
        toast.error(result.error.message);
        setProcessingStatus(null);
        setLoading(false);
        return; // DONT NAVIGATE
      }

      // 4. Handle Success status from Stripe
      if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        setProcessingStatus('Saving your booking...');
        
        // --- STEP 3: SAVE BOOKING TO DATABASE ---
        const bookingData = {
          bikeId: bike._id,
          startDate: dates.startDate,
          endDate: dates.endDate,
          paymentIntentId: result.paymentIntent.id
        };
        
        const bookingRes = await API.post('/bookings', bookingData);
        const savedBooking = bookingRes.data;
        
        // Verify booking was actually saved
        if (!savedBooking || !savedBooking._id) {
           throw new Error('Booking could not be saved. Please contact support with your payment ID: ' + result.paymentIntent.id);
        }

        // --- STEP 4: STORE DATA AND NAVIGATE ---
        // Store in sessionStorage as a reliable bridge since navigate state
        // can be lost when Stripe Elements provider unmounts during route change
        sessionStorage.setItem('lastBookingConfirmation', JSON.stringify({
          booking: savedBooking,
          bike: bike
        }));

        navigatedRef.current = true;
        toast.success('Payment successful! Booking confirmed.');
        navigate('/booking-confirmation', { 
           state: { booking: savedBooking, bike },
           replace: true 
        });
        return;
      } else {
        throw new Error('Authorization incomplete. Please contact your bank.');
      }
    } catch (err) {
      console.error('Master Payment Flow Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Payment encountered a problem';
      setStripeError(errorMessage);
      toast.error(errorMessage);
      setProcessingStatus(null);
    } finally {
      // Only update state if we haven't navigated away
      if (!navigatedRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#fdfaf6] p-6 rounded-2xl border border-[#e2d5c3] shadow-inner mb-6">
        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 block flex items-center gap-2">
          <CreditCard className="h-3 w-3" /> Secure Payment Information
        </label>
        
        <div className={`p-4 bg-white rounded-xl border transition-all ${stripeError ? 'border-red-400 ring-4 ring-red-50' : 'border-[#e2d5c3]'}`}>
          <CardElement 
            onFocus={() => setStripeError(null)}
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#4a3224',
                  fontFamily: 'Outfit, sans-serif',
                  '::placeholder': { color: '#aab7c4' },
                },
                invalid: { color: '#ef4444' },
              },
            }} 
          />
        </div>
        
        <div className="mt-4 flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
           <Info className="h-4 w-4 text-blue-500 mt-0.5" />
           <p className="text-[11px] text-blue-700 font-bold leading-relaxed">
             Test Mode: Use <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200">4242 4242 4242 4242</code> with any future expiry and any 3-digit CVC to simulate success.
           </p>
        </div>

        {stripeError && (
          <div className="mt-4 flex items-center gap-2 text-red-600 text-xs font-bold animate-fadeIn bg-red-50 p-3 rounded-lg border border-red-100">
            <XCircle className="h-4 w-4" />
            {stripeError}
          </div>
        )}
      </div>

      <div className="bg-[#f0ede6] p-6 rounded-2xl space-y-3">
        <div className="flex justify-between items-center text-[#4a3224]">
          <span className="font-bold flex items-center gap-2">
             Amount to be Paid
          </span>
          <span className="text-3xl font-black text-[#8b5e3c]">₹{totalAmount}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-black">
           <ShieldCheck className="h-3 w-3 text-green-600" /> Fully Encrypted Checkout
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full h-16 bg-[#8b5e3c] text-white rounded-2xl font-black text-lg shadow-xl hover:bg-[#6f4b30] transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-wait"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
             <Spinner color="#fff" /> {processingStatus}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-3">
             <CreditCard className="h-6 w-6" /> Confirm & Pay ₹{totalAmount}
          </span>
        )}
      </button>
      
      <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-black">
         PCI-DSS Compliant • 256-Bit SSL • Identity Verified
      </p>
    </form>
  );
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const bike = location.state?.bike;
  const dates = location.state?.dates;
  const totalAmount = location.state?.totalAmount;

  useEffect(() => {
    if (!bike || !dates || !totalAmount) {
      toast.error('Booking session lost. Please try browsing again.');
      navigate('/browse', { replace: true });
    }
  }, [bike, dates, totalAmount, navigate]);

  if (!bike || !dates || !totalAmount) {
    return (
      <div className="min-h-screen bg-[#fdfaf6] flex items-center justify-center">
         <Spinner size="large" />
      </div>
    );
  }

  const startDate = new Date(dates.startDate);
  const endDate = new Date(dates.endDate);

  return (
    <div className="min-h-screen bg-[#fdfaf6] flex flex-col animate-fadeIn">
      <Navbar />
      
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        <div className="mb-12">
            <h1 className="text-4xl font-black text-[#4a3224]">Secure Checkout</h1>
            <p className="text-[#8b5e3c] mt-2 font-bold text-lg">One final step to confirm your adventure.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-12 xl:col-span-5 space-y-6 order-2 lg:order-1">
            <div className="bg-white rounded-[32px] p-8 border border-[#e2d5c3] shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <CreditCard size={100} />
              </div>
              
              <h3 className="text-xl font-black text-[#4a3224] mb-8 uppercase tracking-widest flex items-center gap-3 border-b border-gray-100 pb-4">
                <Info className="h-6 w-6 text-[#8b5e3c]" /> Booking Summary
              </h3>
              
              <div className="space-y-8">
                <div className="flex gap-5 items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="h-20 w-32 rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100">
                    <img src={bike.images?.[0] || 'https://via.placeholder.com/400?text=Bike'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-[#4a3224] text-lg leading-none">{bike.brand}</h4>
                    <p className="text-[#8b5e3c] font-black text-sm">{bike.model}</p>
                    <div className="flex items-center text-[10px] uppercase font-black text-gray-400 mt-2">
                       <MapPin className="h-3 w-3 mr-1" /> {bike.city}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-10 py-2">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Pickup</label>
                        <p className="text-sm font-black text-[#4a3224]">
                             {startDate.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}<br/>
                             <span className="text-[#8b5e3c] flex items-center gap-1 mt-1 font-black text-xs uppercase"><Clock size={12}/> {startDate.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                        </p>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Return</label>
                        <p className="text-sm font-black text-[#4a3224]">
                             {endDate.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}<br/>
                             <span className="text-[#8b5e3c] flex items-center gap-1 mt-1 font-black text-xs uppercase"><Clock size={12}/> {endDate.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                        </p>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 space-y-4">
                    <div className="flex justify-between items-center text-sm font-black uppercase text-gray-400 tracking-wider">
                        <span>Total Payable</span>
                        <span className="text-4xl text-[#8b5e3c] lowercase tracking-normal">₹{totalAmount}</span>
                    </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50/50 p-6 rounded-[24px] border border-green-100 flex gap-4 shadow-sm">
                <CheckCircle className="h-7 w-7 text-green-500 flex-shrink-0" />
                <div>
                  <h4 className="text-[11px] font-black text-green-800 uppercase tracking-widest mb-1">Guaranteed Satisfaction</h4>
                  <p className="text-[12px] text-green-700 font-bold leading-relaxed">This bike is verified by our team. You get instant confirmation and high-quality maintenance checks.</p>
                </div>
            </div>
          </div>

          <div className="lg:col-span-12 xl:col-span-7 bg-white rounded-[32px] p-10 border border-[#e2d5c3] shadow-xl order-1 lg:order-2 ring-1 ring-[#e2d5c3]">
            <h3 className="text-2xl font-black text-[#4a3224] mb-10 flex items-center gap-4">
              <CreditCard className="h-8 w-8 text-[#8b5e3c]" /> Payment Details
            </h3>
            
            <CheckoutForm bike={bike} dates={dates} totalAmount={totalAmount} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Payment;

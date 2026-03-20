import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Bike, CheckCircle, Clock, CreditCard, Lock } from 'lucide-react';

const ProfileSidebar = ({ active }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const items = [
    { icon: <User className="h-5 w-5" />, label: 'Account Details', path: '/profile' },
    { icon: <Bike className="h-5 w-5" />, label: 'My Bookings', path: '/my-bookings' },
    { icon: <CreditCard className="h-5 w-5" />, label: 'Saved Payments', path: '/profile/saved-payments' },
    { icon: <CheckCircle className="h-5 w-5" />, label: 'Privacy & Security', path: '/profile/privacy-security' },
    { icon: <Clock className="h-5 w-5" />, label: 'Notifications', path: '/profile/notifications' },
  ];
  return (
    <aside className="w-full md:w-1/3 bg-white border border-[#e2d5c3] p-8 rounded-3xl shadow-sm" style={{ borderTop: '8px solid #8b5e3c' }}>
      <div className="flex flex-col items-center mb-10 pb-10 border-b border-[#f0e9df]">
        <div className="h-24 w-24 rounded-full bg-[#8b5e3c] flex items-center justify-center font-black text-white text-3xl shadow-xl border-4 border-white">
          {user.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <h3 className="mt-4 text-lg font-black text-[#4a3224]">{user.name || 'User'}</h3>
        <p className="text-xs font-bold text-[#8b5e3c] uppercase tracking-widest mt-1 opacity-70">User Profile</p>
      </div>
      <nav className="space-y-2">
        {items.map(({ icon, label, path }) => (
          <div key={label} onClick={() => navigate(path)}
            className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition cursor-pointer
              ${active === label ? 'bg-[#fdfaf6] text-[#8b5e3c] shadow-sm' : 'text-gray-400 hover:bg-[#fdfaf6] hover:text-[#8b5e3c]'}`}>
            {icon} {label}
          </div>
        ))}
      </nav>
    </aside>
  );
};

const SavedPayments = () => (
  <div className="min-h-screen bg-[#fdfaf6] flex flex-col">
    <Navbar />
    <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <ProfileSidebar active="Saved Payments" />
        <div className="flex-1 bg-white border border-[#e2d5c3] p-10 rounded-3xl shadow-2xl">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-[#4a3224]">Saved Payments</h2>
            <p className="text-[#8b5e3c] mt-1 font-medium">Manage your payment methods.</p>
          </div>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-24 w-24 rounded-full bg-[#fdfaf6] border-2 border-dashed border-[#e2d5c3] flex items-center justify-center mb-6">
              <Lock className="h-10 w-10 text-[#8b5e3c] opacity-50" />
            </div>
            <h3 className="text-xl font-black text-[#4a3224] mb-3">Coming Soon</h3>
            <p className="text-gray-400 max-w-sm">Saved payment methods will be available once Stripe integration is fully configured. Your payments are always secure.</p>
            <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[#fdfaf6] border border-[#e2d5c3] rounded-2xl text-sm text-[#8b5e3c] font-bold">
              <CheckCircle className="h-4 w-4" /> Payments secured by Stripe
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default SavedPayments;

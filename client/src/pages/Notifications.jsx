import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Bike, CheckCircle, Clock, CreditCard, Bell, Mail, MessageSquare, Tag } from 'lucide-react';

const Toast = ({ msg, type, onClose }) => {
  if (!msg) return null;
  const bg = type === 'success' ? '#22c55e' : '#3b82f6';
  return (
    <div style={{ position:'fixed', bottom:32, right:32, background:bg, color:'#fff', padding:'14px 24px', borderRadius:12, fontWeight:700, fontSize:15, zIndex:9999, boxShadow:'0 4px 24px rgba(0,0,0,.18)', display:'flex', alignItems:'center', gap:10, maxWidth:360 }}>
      {msg}
      <button onClick={onClose} style={{ marginLeft:8, background:'none', border:'none', color:'#fff', cursor:'pointer', fontSize:18 }}>×</button>
    </div>
  );
};

const ProfileSidebar = ({ active }) => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
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

const Toggle = ({ checked, onChange }) => (
  <button type="button" onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-[#8b5e3c]' : 'bg-gray-200'}`}>
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const NotificationRow = ({ icon, title, desc, checked, onChange }) => (
  <div className="flex items-center justify-between py-5 border-b border-[#fdfaf6] last:border-0">
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 rounded-full bg-[#fdfaf6] border border-[#e2d5c3] flex items-center justify-center text-[#8b5e3c]">
        {icon}
      </div>
      <div>
        <p className="font-bold text-[#4a3224] text-sm">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
    </div>
    <Toggle checked={checked} onChange={onChange} />
  </div>
);

const Notifications = () => {
  const [prefs, setPrefs] = useState({
    bookingConfirmation: true,
    bookingReminders: true,
    promotions: false,
    smsAlerts: false,
    newBikesNearby: false,
    reviewRequests: true,
  });
  const [toast, setToast] = useState({ msg: '', type: '' });

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const handleSave = () => {
    setToast({ msg: 'Notification preferences saved!', type: 'success' });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  return (
    <div className="min-h-screen bg-[#fdfaf6] flex flex-col">
      <Navbar />
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: '' })} />
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <ProfileSidebar active="Notifications" />
          <div className="flex-1 bg-white border border-[#e2d5c3] p-10 rounded-3xl shadow-2xl">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-[#4a3224]">Notification Preferences</h2>
              <p className="text-[#8b5e3c] mt-1 font-medium">Choose what updates you want to receive.</p>
            </div>

            <div className="mb-6">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email Notifications
              </p>
              <NotificationRow icon={<Bell className="h-5 w-5" />} title="Booking Confirmations" desc="Get notified when your booking is confirmed" checked={prefs.bookingConfirmation} onChange={() => toggle('bookingConfirmation')} />
              <NotificationRow icon={<Clock className="h-5 w-5" />} title="Booking Reminders" desc="Reminders before your rental starts" checked={prefs.bookingReminders} onChange={() => toggle('bookingReminders')} />
              <NotificationRow icon={<CheckCircle className="h-5 w-5" />} title="Review Requests" desc="Reminder to review after your trip" checked={prefs.reviewRequests} onChange={() => toggle('reviewRequests')} />
              <NotificationRow icon={<Tag className="h-5 w-5" />} title="Promotions & Offers" desc="Special deals and platform promotions" checked={prefs.promotions} onChange={() => toggle('promotions')} />
            </div>

            <div className="mb-8">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> SMS Notifications
              </p>
              <NotificationRow icon={<MessageSquare className="h-5 w-5" />} title="SMS Alerts" desc="Critical booking updates via SMS" checked={prefs.smsAlerts} onChange={() => toggle('smsAlerts')} />
              <NotificationRow icon={<Bike className="h-5 w-5" />} title="New Bikes Nearby" desc="Get alerts when new bikes are listed near you" checked={prefs.newBikesNearby} onChange={() => toggle('newBikesNearby')} />
            </div>

            <button onClick={handleSave}
              className="px-10 py-4 bg-[#8b5e3c] text-white rounded-2xl font-black shadow-lg hover:bg-[#6f4b30] transition-all flex items-center gap-2">
              <Bell className="h-5 w-5" /> Save Preferences
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Notifications;

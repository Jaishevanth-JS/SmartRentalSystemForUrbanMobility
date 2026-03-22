import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Phone, Mail, Settings, CheckCircle, Clock, Bike, CreditCard } from 'lucide-react';

/* ─── tiny inline toast ─────────────────────────────── */
const Toast = ({ msg, type, onClose }) => {
  if (!msg) return null;
  const bg =
    type === 'success' ? '#22c55e' :
    type === 'error'   ? '#ef4444' :
                         '#3b82f6';
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        background: bg,
        color: '#fff',
        padding: '14px 24px',
        borderRadius: 12,
        fontWeight: 700,
        fontSize: 15,
        zIndex: 9999,
        boxShadow: '0 4px 24px rgba(0,0,0,.18)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        maxWidth: 360,
      }}
    >
      {msg}
      <button onClick={onClose} style={{ marginLeft: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
    </div>
  );
};

/* ─── tiny inline spinner ────────────────────────────── */
const BtnSpinner = () => (
  <span
    style={{
      display: 'inline-block',
      width: 18,
      height: 18,
      border: '2px solid rgba(255,255,255,.4)',
      borderTop: '2px solid #fff',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }}
  />
);

/* ─── Profile Page ───────────────────────────────────── */
const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData]     = useState({ name: '', phone: '', email: '', profileImage: '' });
  const [originalData, setOriginalData] = useState({ name: '', phone: '', email: '', profileImage: '' });
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]           = useState({ msg: '', type: '' });

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3500);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/auth/me');
        const userData = {
          name:         res.data.name         || '',
          phone:        res.data.phone        || '',
          email:        res.data.email        || '',
          profileImage: res.data.profileImage || '',
        };
        setFormData(userData);
        setOriginalData(userData);
      } catch (err) {
        console.error('Profile fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.put('/auth/update-profile', {
        name:         formData.name,
        phone:        formData.phone,
        profileImage: formData.profileImage,
      });
      showToast('Details saved successfully!', 'success');
      setOriginalData({ ...formData });
      sessionStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (err) {
      showToast(err.response?.data?.message || 'Error updating profile', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    showToast('Changes discarded', 'info');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf6]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5e3c]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf6] flex flex-col">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <Navbar />

      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: '' })} />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex flex-col md:flex-row gap-12 items-start">

          {/* ── Sidebar ── */}
          <aside className="w-full md:w-1/3 bg-white border border-[#e2d5c3] p-8 rounded-3xl shadow-sm"
            style={{ borderTop: '8px solid #8b5e3c' }}>

            <div className="flex flex-col items-center mb-10 pb-10 border-b border-[#f0e9df]">
              <div className="relative h-28 w-28 rounded-full border-4 border-white shadow-xl bg-[#8b5e3c] overflow-hidden">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-black text-white text-3xl">
                    {formData.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <h3 className="mt-6 text-xl font-black text-[#4a3224]">{formData.name || 'User'}</h3>
              <p className="text-sm font-bold text-[#8b5e3c] uppercase tracking-widest mt-1 opacity-70">User Profile</p>
            </div>

            <nav className="space-y-2">
              {[
                { icon: <User className="h-5 w-5" />,        label: 'Account Details',   path: null,                         active: true  },
                { icon: <Bike className="h-5 w-5" />,        label: 'My Bookings',        path: '/my-bookings',               active: false },
                { icon: <CreditCard className="h-5 w-5" />,  label: 'Saved Payments',     path: '/profile/saved-payments',    active: false },
                { icon: <CheckCircle className="h-5 w-5" />, label: 'Privacy & Security', path: '/profile/privacy-security',  active: false },
                { icon: <Clock className="h-5 w-5" />,       label: 'Notifications',      path: '/profile/notifications',     active: false },
              ].map(({ icon, label, path, active }) => (
                <div key={label}
                  onClick={() => path && navigate(path)}
                  className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition
                    ${active ? 'bg-[#fdfaf6] text-[#8b5e3c] shadow-sm cursor-default' : 'text-gray-400 hover:bg-[#fdfaf6] hover:text-[#8b5e3c] cursor-pointer'}`}
                >
                  {icon} {label}
                </div>
              ))}
            </nav>
          </aside>

          {/* ── Form ── */}
          <div className="flex-1 bg-white border border-[#e2d5c3] p-10 rounded-3xl shadow-2xl">
            <div className="mb-10">
              <h2 className="text-2xl font-black text-[#4a3224]">Profile Settings</h2>
              <p className="text-[#8b5e3c] mt-1 font-medium">Update your account information and preferences.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block pl-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      className="w-full pl-12 pr-5 py-4 bg-[#fdfaf6] border border-[#e2d5c3] rounded-2xl focus:outline-none focus:border-[#8b5e3c] text-sm font-bold"
                      value={formData.name}
                      onChange={handleChange('name')}
                      required
                    />
                  </div>
                </div>

                {/* Email (read-only) */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block pl-1">Email (Read-only)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      readOnly
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-[#e2d5c3]/50 rounded-2xl text-sm font-bold text-gray-400 cursor-not-allowed"
                      value={formData.email}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block pl-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      className="w-full pl-12 pr-5 py-4 bg-[#fdfaf6] border border-[#e2d5c3] rounded-2xl focus:outline-none focus:border-[#8b5e3c] text-sm font-bold"
                      value={formData.phone}
                      placeholder="e.g. +91 9876543210"
                      onChange={handleChange('phone')}
                    />
                  </div>
                </div>

                {/* Photo URL */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block pl-1">Profile Photo URL</label>
                  <div className="relative">
                    <Settings className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      className="w-full pl-12 pr-5 py-4 bg-[#fdfaf6] border border-[#e2d5c3] rounded-2xl focus:outline-none focus:border-[#8b5e3c] text-sm font-bold"
                      value={formData.profileImage}
                      placeholder="https://your-image-url..."
                      onChange={handleChange('profileImage')}
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-8 border-t border-[#f0e9df] flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-10 py-4 bg-[#8b5e3c] text-white rounded-2xl font-black shadow-lg hover:bg-[#6f4b30] active:scale-95 transition-all flex items-center justify-center gap-3 min-w-[200px]"
                >
                  {submitting ? <BtnSpinner /> : <CheckCircle className="h-5 w-5" />}
                  {submitting ? 'Saving…' : 'Save Changes'}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={submitting}
                  className="px-10 py-4 border-2 border-[#8b5e3c] text-[#8b5e3c] rounded-2xl font-bold hover:bg-[#8b5e3c] hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;

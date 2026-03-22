import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Bike, CheckCircle, Clock, CreditCard, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';

/* ── shared Toast ── */
const Toast = ({ msg, type, onClose }) => {
  if (!msg) return null;
  const bg = type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6';
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

const PrivacySecurity = () => {
  const navigate = useNavigate();
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [toast, setToast] = useState({ msg: '', type: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3500);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      showToast('New passwords do not match', 'error'); return;
    }
    if (pwdForm.newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error'); return;
    }
    setSubmitting(true);
    try {
      await API.put('/auth/change-password', {
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
      });
      showToast('Password changed successfully!', 'success');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Error changing password', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      showToast('Please type DELETE to confirm', 'error'); return;
    }
    try {
      await API.delete('/auth/delete-account');
      sessionStorage.clear();
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error deleting account', 'error');
    }
  };

  const PwdInput = ({ field, label, showKey }) => (
    <div className="space-y-2">
      <label className="text-xs font-black text-gray-400 uppercase tracking-widest block pl-1">{label}</label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type={showPwd[showKey] ? 'text' : 'password'}
          className="w-full pl-12 pr-12 py-4 bg-[#fdfaf6] border border-[#e2d5c3] rounded-2xl focus:outline-none focus:border-[#8b5e3c] text-sm font-bold"
          value={pwdForm[field]}
          onChange={(e) => setPwdForm({ ...pwdForm, [field]: e.target.value })}
          required
        />
        <button type="button" onClick={() => setShowPwd({ ...showPwd, [showKey]: !showPwd[showKey] })}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8b5e3c]">
          {showPwd[showKey] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfaf6] flex flex-col">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Navbar />
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: '' })} />
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <ProfileSidebar active="Privacy & Security" />
          <div className="flex-1 space-y-8">
            {/* Change Password */}
            <div className="bg-white border border-[#e2d5c3] p-10 rounded-3xl shadow-2xl">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-[#4a3224]">Change Password</h2>
                <p className="text-[#8b5e3c] mt-1 font-medium">Update your password to keep your account secure.</p>
              </div>
              <form onSubmit={handleChangePassword} className="space-y-6">
                <PwdInput field="currentPassword" label="Current Password" showKey="current" />
                <PwdInput field="newPassword" label="New Password" showKey="new" />
                <PwdInput field="confirmPassword" label="Confirm New Password" showKey="confirm" />
                <button type="submit" disabled={submitting}
                  className="px-10 py-4 bg-[#8b5e3c] text-white rounded-2xl font-black shadow-lg hover:bg-[#6f4b30] transition-all flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  {submitting ? 'Updating…' : 'Update Password'}
                </button>
              </form>
            </div>

            {/* Delete Account */}
            <div className="bg-white border border-red-100 p-10 rounded-3xl shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-red-600">Delete Account</h3>
                  <p className="text-sm text-gray-500">This action is permanent and cannot be undone.</p>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Type DELETE to confirm</label>
                <input type="text" placeholder="DELETE"
                  className="w-full px-5 py-4 bg-red-50 border border-red-200 rounded-2xl focus:outline-none focus:border-red-400 text-sm font-bold text-red-600"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                />
                <button onClick={handleDeleteAccount}
                  className="px-8 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all">
                  Permanently Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacySecurity;

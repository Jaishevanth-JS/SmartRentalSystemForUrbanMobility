import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import VendorLayout from '../../components/VendorLayout';
import { User, Phone, Mail, Settings, CheckCircle } from 'lucide-react';

const Toast = ({ msg, type, onClose }) => {
  if (!msg) return null;
  const bg = type === 'success' ? '#22c55e' : '#ef4444';
  return (
    <div style={{ position:'fixed', bottom:32, right:32, background:bg, color:'#fff', padding:'14px 24px', borderRadius:12, fontWeight:700, fontSize:15, zIndex:9999, boxShadow:'0 4px 24px rgba(0,0,0,.18)', display:'flex', alignItems:'center', gap:10, maxWidth:360 }}>
      {msg}<button onClick={onClose} style={{ marginLeft:8, background:'none', border:'none', color:'#fff', cursor:'pointer', fontSize:18 }}>×</button>
    </div>
  );
};


const BtnSpinner = () => (
  <span style={{ display:'inline-block', width:18, height:18, border:'2px solid rgba(255,255,255,.4)', borderTop:'2px solid #fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
);

const VendorProfile = () => {
  const [formData, setFormData]     = useState({ name:'', phone:'', email:'', profileImage:'' });
  const [originalData, setOriginalData] = useState({ name:'', phone:'', email:'', profileImage:'' });
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]           = useState({ msg:'', type:'' });

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:'', type:'' }), 3500);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/auth/me');
        const d = { name: res.data.name||'', phone: res.data.phone||'', email: res.data.email||'', profileImage: res.data.profileImage||'' };
        setFormData(d); setOriginalData(d);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const set = (field) => (e) => setFormData(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.put('/auth/update-profile', {
        name: formData.name, phone: formData.phone, profileImage: formData.profileImage
      });
      showToast('Profile saved successfully!', 'success');
      setOriginalData({ ...formData });
      sessionStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (err) {
      showToast(err.response?.data?.message || 'Error updating profile', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <VendorLayout title="My Profile">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5e3c]" />
      </div>
    </VendorLayout>
  );

  const inp = "w-full pl-12 pr-5 py-4 bg-[#f5f0eb] border border-[#e2d5c3] rounded-2xl focus:outline-none focus:border-[#8b5e3c] text-sm font-bold";

  return (
    <VendorLayout title="My Profile">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg:'', type:'' })} />

      <div className="max-w-2xl mx-auto">
        {/* Avatar */}
        <div className="bg-white rounded-2xl border border-[#e2d5c3] p-6 shadow-sm mb-6 flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-[#8b5e3c] flex items-center justify-center font-black text-white text-3xl shadow-lg flex-shrink-0 overflow-hidden">
            {formData.profileImage
              ? <img src={formData.profileImage} alt="" className="h-full w-full object-cover" />
              : formData.name?.[0]?.toUpperCase() || 'V'
            }
          </div>
          <div>
            <h3 className="text-xl font-black text-[#4a3224]">{formData.name || 'Vendor'}</h3>
            <p className="text-sm text-gray-400">{formData.email}</p>
            <span className="mt-1 inline-block text-xs bg-[#f5f0eb] text-[#8b5e3c] px-3 py-1 rounded-full font-black">Vendor Account</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-[#e2d5c3] p-8 shadow-sm">
          <h3 className="font-black text-[#4a3224] mb-6 text-lg">Edit Profile Details</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input type="text" className={inp} value={formData.name} onChange={set('name')} required />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Email (read-only)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input type="email" readOnly className={inp + " cursor-not-allowed bg-gray-50 text-gray-400"} value={formData.email} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input type="text" className={inp} value={formData.phone} onChange={set('phone')} placeholder="+91 9876543210" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Profile Photo URL</label>
                <div className="relative">
                  <Settings className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input type="text" className={inp} value={formData.profileImage} onChange={set('profileImage')} placeholder="https://..." />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button type="submit" disabled={submitting}
                className="flex-1 py-4 bg-[#8b5e3c] text-white rounded-2xl font-black hover:bg-[#6f4b30] transition flex items-center justify-center gap-3 shadow-lg">
                {submitting ? <BtnSpinner /> : <CheckCircle className="h-5 w-5" />}
                {submitting ? 'Saving…' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setFormData({ ...originalData })}
                className="px-8 py-4 border-2 border-[#8b5e3c] text-[#8b5e3c] rounded-2xl font-bold hover:bg-[#8b5e3c] hover:text-white transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorProfile;

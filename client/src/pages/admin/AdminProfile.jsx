import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';
import { User, Phone, Mail, Settings, CheckCircle } from 'lucide-react';

const AdminProfile = () => {
  const [formData, setFormData] = useState({ name:'', phone:'', email:'', profileImage:'' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/auth/me');
        setFormData({ name: res.data.name||'', phone: res.data.phone||'', email: res.data.email||'', profileImage: res.data.profileImage||'' });
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.put('/auth/update-profile', { name: formData.name, phone: formData.phone, profileImage: formData.profileImage });
      alert('Profile updated successfully!');
      sessionStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (err) { alert('Error updating profile'); } finally { setSubmitting(false); }
  };

  const inp = "w-full pl-12 pr-5 py-4 bg-[#f5f0eb] border border-[#e2d5c3] rounded-2xl focus:outline-none focus:border-[#8b5e3c] text-sm font-bold";

  return (
    <AdminLayout title="Admin Profile">
      {loading ? (
        <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5e3c]" /></div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-[#e2d5c3] p-8 md:p-10 shadow-sm">
          <div className="flex items-center gap-6 mb-10 pb-8 border-b border-[#f0e9df]">
            <div className="h-24 w-24 rounded-full bg-[#8b5e3c] flex items-center justify-center font-black text-white text-4xl shadow-xl overflow-hidden">
              {formData.profileImage ? <img src={formData.profileImage} alt="" className="h-full w-full object-cover" /> : formData.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#4a3224]">{formData.name}</h3>
              <p className="text-gray-400 mt-1">{formData.email}</p>
              <span className="mt-2 inline-block text-[10px] bg-red-100 text-red-700 px-3 py-1 rounded-full font-black uppercase tracking-widest">Administrator</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="text" className={inp} value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Email <span className="text-red-400">(Read-Only)</span></label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="email" readOnly className={inp + " cursor-not-allowed opacity-70"} value={formData.email} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="text" className={inp} value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Profile Photo URL</label>
                <div className="relative">
                  <Settings className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="text" className={inp} value={formData.profileImage} onChange={e=>setFormData({...formData, profileImage: e.target.value})} placeholder="https://..." />
                </div>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full sm:w-auto mt-4 px-8 py-4 bg-[#8b5e3c] text-white rounded-2xl font-black hover:bg-[#6f4b30] transition shadow-lg flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5" /> {submitting ? 'Saving changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProfile;

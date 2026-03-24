import React, { useState } from 'react';
import API from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Shield, AlertCircle, CheckCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'User' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');
    try {
      await API.post('/auth/register', formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf6] px-4 animate-fadeIn">
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-[#e2d5c3] text-center max-w-md w-full">
          <div className="bg-green-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-[#4a3224] mb-2">Account Created!</h2>
          <p className="text-gray-500 mb-6">Redirecting you to login...</p>
          <Link to="/login" className="text-[#8b5e3c] font-bold hover:underline">Go to Login →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf6] px-4 animate-fadeIn">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black text-[#8b5e3c] inline-block">
            Bike<span className="text-[#4a3224]">Rent</span>
          </Link>
          <p className="text-gray-500 mt-2">Create your account to get started.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#e2d5c3]">
          {apiError && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 text-sm font-medium">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              {apiError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  className={`w-full pl-12 pr-4 py-4 bg-[#fdfaf6] border rounded-2xl focus:outline-none focus:border-[#8b5e3c] text-sm font-bold transition ${errors.name ? 'border-red-400' : 'border-[#e2d5c3]'}`}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs font-bold mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  className={`w-full pl-12 pr-4 py-4 bg-[#fdfaf6] border rounded-2xl focus:outline-none focus:border-[#8b5e3c] text-sm font-bold transition ${errors.email ? 'border-red-400' : 'border-[#e2d5c3]'}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs font-bold mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  className={`w-full pl-12 pr-4 py-4 bg-[#fdfaf6] border rounded-2xl focus:outline-none focus:border-[#8b5e3c] text-sm font-bold transition ${errors.password ? 'border-red-400' : 'border-[#e2d5c3]'}`}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs font-bold mt-1">{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Register As</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  name="role"
                  className="w-full pl-12 pr-4 py-4 bg-[#fdfaf6] border border-[#e2d5c3] rounded-2xl focus:outline-none focus:border-[#8b5e3c] text-sm font-bold appearance-none cursor-pointer"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="User">User (Rent Bikes)</option>
                  <option value="Vendor">Vendor (List Bikes)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#8b5e3c] text-white rounded-2xl font-black text-lg hover:bg-[#6f4b30] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-block h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <><UserPlus className="h-5 w-5" /> Create Account</>
              )}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-[#8b5e3c] font-bold hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

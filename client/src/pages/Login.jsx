import React, { useState } from 'react';
import API from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email';
    if (!formData.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');
    try {
      const response = await API.post('/auth/login', formData);
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data.user));

      // Role-based redirect
      if (response.data.user.role === 'Admin') {
        navigate('/admin', { replace: true });
      } else if (response.data.user.role === 'Vendor') {
        navigate('/vendor', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf6] px-4 animate-fadeIn">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black text-[#8b5e3c] inline-block">
            Bike<span className="text-[#4a3224]">Rent</span>
          </Link>
          <p className="text-gray-500 mt-2">Welcome back! Sign in to continue.</p>
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
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs font-bold mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#8b5e3c] text-white rounded-2xl font-black text-lg hover:bg-[#6f4b30] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-block h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn className="h-5 w-5" /> Sign In</>
              )}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#8b5e3c] font-bold hover:underline">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Route based on role
      if (response.data.user.role === 'Admin') {
        navigate('/admin');
      } else if (response.data.user.role === 'Vendor') {
        navigate('/vendor');
      } else {
        navigate('/user');
      }
      
      // Update app state for navigation via page reload since App.jsx reads from localStorage on mount.
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="app-container">
      <div className="auth-card">
        <h2 className="auth-header">Sign In</h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="auth-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              className="auth-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="auth-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="auth-btn">Login</button>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

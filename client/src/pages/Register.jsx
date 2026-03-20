import React, { useState } from 'react';
import API from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'User' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="app-container">
      <div className="auth-card">
        <h2 className="auth-header">Create an Account</h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="auth-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              className="auth-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
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
          <div className="auth-group">
            <label>Role</label>
            <select name="role" className="auth-select" value={formData.role} onChange={handleChange}>
              <option value="User">User</option>
              <option value="Vendor">Vendor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="auth-btn">Register</button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

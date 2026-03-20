import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import VendorDashboard from './pages/VendorDashboard';
import UserDashboard from './pages/UserDashboard';

function App() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const getDashboardPath = () => {
    if (user.role === 'Admin') return '/admin';
    if (user.role === 'Vendor') return '/vendor';
    return '/user';
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/admin" 
          element={token && user.role === 'Admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/vendor" 
          element={token && user.role === 'Vendor' ? <VendorDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/user" 
          element={token && user.role === 'User' ? <UserDashboard /> : <Navigate to="/login" />} 
        />
        
        {/* Default Route */}
        <Route 
          path="/" 
          element={token ? <Navigate to={getDashboardPath()} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;

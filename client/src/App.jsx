import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import BrowseBikes from './pages/BrowseBikes';
import BikeDetail from './pages/BikeDetail';
import Payment from './pages/Payment';
import BookingConfirmation from './pages/BookingConfirmation';
import UserDashboard from './pages/UserDashboard';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import SavedPayments from './pages/SavedPayments';
import PrivacySecurity from './pages/PrivacySecurity';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import VendorDashboard from './pages/VendorDashboard';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Terms from './pages/Terms';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <Router>
      <div className="min-h-screen bg-[#fdfaf6]">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<BrowseBikes />} />
          <Route path="/bikes/:id" element={<BikeDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Footer Pages — public */}
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />

          {/* User Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute role="User"><UserDashboard /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute role="User"><MyBookings /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute role="User"><Payment /></ProtectedRoute>} />
          <Route path="/booking-confirmation" element={<ProtectedRoute role="User"><BookingConfirmation /></ProtectedRoute>} />

          {/* Profile & Sub-pages */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/saved-payments" element={<ProtectedRoute><SavedPayments /></ProtectedRoute>} />
          <Route path="/profile/privacy-security" element={<ProtectedRoute><PrivacySecurity /></ProtectedRoute>} />
          <Route path="/profile/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

          {/* Admin / Vendor */}
          <Route path="/admin" element={<ProtectedRoute role="Admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/vendor" element={<ProtectedRoute role="Vendor"><VendorDashboard /></ProtectedRoute>} />

          {/* Redirects */}
          <Route path="/home" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

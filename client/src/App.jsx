import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public / User Pages
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
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Terms from './pages/Terms';

// Admin
import AdminOverview from './pages/admin/AdminOverview';
import ManageUsers from './pages/admin/ManageUsers';
import ManageBikes from './pages/admin/ManageBikes';
import PendingApprovals from './pages/admin/PendingApprovals';
import ManageBookings from './pages/admin/ManageBookings';
import RevenueAnalytics from './pages/admin/RevenueAnalytics';
import AdminProfile from './pages/admin/AdminProfile';

// Vendor Pages
import VendorOverview from './pages/vendor/VendorOverview';
import AddBike from './pages/vendor/AddBike';
import MyBikes from './pages/vendor/MyBikes';
import EditBike from './pages/vendor/EditBike';
import VendorBookings from './pages/vendor/VendorBookings';
import VendorEarnings from './pages/vendor/VendorEarnings';
import VendorProfile from './pages/vendor/VendorProfile';

// Route Guard
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#fdfaf6]">
        <Routes>
          {/* ── Public routes ─────────────────────────────────── */}
          <Route path="/"        element={<Home />} />
          <Route path="/browse"  element={<BrowseBikes />} />
          <Route path="/bikes/:id" element={<BikeDetail />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/faq"     element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms"   element={<Terms />} />

          {/* ── User protected routes ──────────────────────────── */}
          <Route path="/dashboard"            element={<ProtectedRoute role="User"><UserDashboard /></ProtectedRoute>} />
          <Route path="/my-bookings"          element={<ProtectedRoute role="User"><MyBookings /></ProtectedRoute>} />
          <Route path="/payment"              element={<ProtectedRoute role="User"><Payment /></ProtectedRoute>} />
          <Route path="/booking-confirmation" element={<ProtectedRoute role="User"><BookingConfirmation /></ProtectedRoute>} />
          <Route path="/profile"              element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/saved-payments"   element={<ProtectedRoute><SavedPayments /></ProtectedRoute>} />
          <Route path="/profile/privacy-security" element={<ProtectedRoute><PrivacySecurity /></ProtectedRoute>} />
          <Route path="/profile/notifications"    element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

          {/* ── Admin routes ──────────────────────────────────── */}
          <Route path="/admin"          element={<ProtectedRoute role="Admin"><AdminOverview /></ProtectedRoute>} />
          <Route path="/admin/users"    element={<ProtectedRoute role="Admin"><ManageUsers /></ProtectedRoute>} />
          <Route path="/admin/bikes"    element={<ProtectedRoute role="Admin"><ManageBikes /></ProtectedRoute>} />
          <Route path="/admin/pending"  element={<ProtectedRoute role="Admin"><PendingApprovals /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute role="Admin"><ManageBookings /></ProtectedRoute>} />
          <Route path="/admin/revenue"  element={<ProtectedRoute role="Admin"><RevenueAnalytics /></ProtectedRoute>} />
          <Route path="/admin/profile"  element={<ProtectedRoute role="Admin"><AdminProfile /></ProtectedRoute>} />

          {/* ── Vendor routes ─────────────────────────────────── */}
          <Route path="/vendor"               element={<ProtectedRoute role="Vendor"><VendorOverview /></ProtectedRoute>} />
          <Route path="/vendor/bikes"         element={<ProtectedRoute role="Vendor"><MyBikes /></ProtectedRoute>} />
          <Route path="/vendor/add-bike"      element={<ProtectedRoute role="Vendor"><AddBike /></ProtectedRoute>} />
          <Route path="/vendor/edit-bike/:id" element={<ProtectedRoute role="Vendor"><EditBike /></ProtectedRoute>} />
          <Route path="/vendor/bookings"      element={<ProtectedRoute role="Vendor"><VendorBookings /></ProtectedRoute>} />
          <Route path="/vendor/earnings"      element={<ProtectedRoute role="Vendor"><VendorEarnings /></ProtectedRoute>} />
          <Route path="/vendor/profile"       element={<ProtectedRoute role="Vendor"><VendorProfile /></ProtectedRoute>} />

          {/* ── Redirects ─────────────────────────────────────── */}
          <Route path="/home" element={<Navigate to="/" />} />
          <Route path="*"     element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

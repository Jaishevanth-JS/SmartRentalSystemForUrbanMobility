import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-[#e2d5c3] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-[#8b5e3c]">
              Bike<span className="text-[#4a3224]">Rent</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
            <Link to="/" className="link-brown">Home</Link>
            <Link to="/browse" className="link-brown">Browse</Link>
            {token ? (
              <>
                {(user.role === 'Admin' || user.role === 'Vendor') && (
                  <Link to="/dashboard" className="link-brown">Dashboard</Link>
                )}
                <Link to="/my-bookings" className="link-brown">My Bookings</Link>
                <Link to="/profile" className="link-brown flex items-center">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="" className="h-8 w-8 rounded-full mr-2 object-cover border border-[#8b5e3c]" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#8b5e3c] text-white flex items-center justify-center mr-2">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  {user.name}
                </Link>
                <button onClick={handleLogout} className="btn-outline-brown">Logout</button>
              </>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="link-brown">Login</Link>
                <Link to="/register" className="btn-brown">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

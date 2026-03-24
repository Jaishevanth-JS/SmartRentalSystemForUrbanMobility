import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, Search, Bike, User, LogOut, CalendarCheck } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const token = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setMobileOpen(false);
    navigate('/');
  };

  const dashboardPath = user.role === 'Admin' ? '/admin' : user.role === 'Vendor' ? '/vendor' : '/';

  const isActive = (path) => location.pathname === path;

  const NavLinks = ({ mobile }) => (
    <>
      <Link to="/" onClick={() => setMobileOpen(false)}
        className={`${mobile ? 'block py-3 px-4 rounded-xl' : ''} link-brown transition font-bold text-sm ${isActive('/') ? 'text-[#8b5e3c]' : ''}`}>
        Home
      </Link>
      <Link to="/browse" onClick={() => setMobileOpen(false)}
        className={`${mobile ? 'block py-3 px-4 rounded-xl' : ''} link-brown transition font-bold text-sm ${isActive('/browse') ? 'text-[#8b5e3c]' : ''}`}>
        Browse
      </Link>
      {token ? (
        <>
          {(user.role === 'Admin' || user.role === 'Vendor') && (
            <Link to={dashboardPath} onClick={() => setMobileOpen(false)}
              className={`${mobile ? 'block py-3 px-4 rounded-xl' : ''} link-brown transition font-bold text-sm`}>
              Dashboard
            </Link>
          )}
          <Link to="/my-bookings" onClick={() => setMobileOpen(false)}
            className={`${mobile ? 'block py-3 px-4 rounded-xl' : ''} link-brown transition font-bold text-sm ${isActive('/my-bookings') ? 'text-[#8b5e3c]' : ''}`}>
            My Bookings
          </Link>
          <Link to="/profile" onClick={() => setMobileOpen(false)}
            className={`${mobile ? 'flex items-center gap-2 py-3 px-4 rounded-xl' : 'flex items-center'} link-brown transition font-bold text-sm`}>
            {user.profileImage ? (
              <img src={user.profileImage} alt="" className="h-7 w-7 rounded-full mr-1.5 object-cover border border-[#8b5e3c]" />
            ) : (
              <div className="h-7 w-7 rounded-full bg-[#8b5e3c] text-white flex items-center justify-center mr-1.5 text-xs font-black">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            {user.name}
          </Link>
          {mobile ? (
            <button onClick={handleLogout}
              className="w-full text-left py-3 px-4 rounded-xl text-red-500 font-bold text-sm hover:bg-red-50 transition">
              Logout
            </button>
          ) : (
            <button onClick={handleLogout} className="btn-outline-brown text-sm">Logout</button>
          )}
        </>
      ) : (
        <>
          {mobile ? (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}
                className="block py-3 px-4 rounded-xl link-brown font-bold text-sm">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}
                className="block py-3 px-4 rounded-xl bg-[#8b5e3c] text-white font-bold text-sm text-center">
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="link-brown font-bold text-sm">Login</Link>
              <Link to="/register" className="btn-brown text-sm">Register</Link>
            </div>
          )}
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white shadow-sm border-b border-[#e2d5c3] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-[#8b5e3c]">
              Bike<span className="text-[#4a3224]">Rent</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
          </div>

          {/* Mobile Hamburger */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-[#8b5e3c] hover:bg-[#f5f0eb] transition">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#e2d5c3] px-4 py-4 space-y-1 animate-fadeIn shadow-lg">
          <NavLinks mobile />
        </div>
      )}
    </nav>
  );
};

export default Navbar;

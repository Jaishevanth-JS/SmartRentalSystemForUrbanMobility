import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    // If already on home page, scroll; otherwise go to home then scroll
    if (window.location.pathname === '/') {
      const el = document.getElementById('how-it-works');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#how-it-works');
    }
  };

  return (
    <footer className="bg-[#4a3224] text-[#fdfaf6] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Bike<span className="text-[#8b5e3c]">Rent</span></h3>
            <p className="text-[#e2d5c3] max-w-sm mb-6">
              Premium bike rentals for your next adventure. Easy booking, secure payments, and reliable support.
            </p>
            <div className="flex gap-4">
              {['facebook','twitter','instagram'].map((s) => (
                <a key={s} href="#" aria-label={s}
                  className="h-9 w-9 rounded-full bg-[#6f4b30] flex items-center justify-center text-[#e2d5c3] hover:bg-[#8b5e3c] transition text-xs font-black uppercase">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-[#8b5e3c] uppercase text-xs tracking-widest">Quick Links</h4>
            <ul className="space-y-3 text-[#e2d5c3]">
              <li>
                <Link to="/" className="hover:text-white transition text-sm">Home</Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-white transition text-sm">Browse Bikes</Link>
              </li>
              <li>
                <button onClick={scrollToHowItWorks} className="hover:text-white transition text-sm text-left">How it Works</button>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-white transition text-sm">My Bookings</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-[#8b5e3c] uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-3 text-[#e2d5c3]">
              <li>
                <Link to="/faq" className="hover:text-white transition text-sm">FAQ</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition text-sm">Contact Us</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition text-sm">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#6f4b30] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[#e2d5c3] text-sm">
          <p>&copy; {new Date().getFullYear()} BikeRent Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms</Link>
            <Link to="/contact" className="hover:text-white transition">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

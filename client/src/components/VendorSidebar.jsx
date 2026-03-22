import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Bike, PlusCircle, CalendarCheck,
  TrendingUp, User, LogOut, ChevronRight, Menu, X
} from 'lucide-react';

const navItems = [
  { label: 'Overview',    icon: LayoutDashboard, path: '/vendor' },
  { label: 'My Bikes',   icon: Bike,            path: '/vendor/bikes' },
  { label: 'Add Bike',   icon: PlusCircle,       path: '/vendor/add-bike' },
  { label: 'Bookings',   icon: CalendarCheck,    path: '/vendor/bookings' },
  { label: 'Earnings',   icon: TrendingUp,       path: '/vendor/earnings' },
  { label: 'Profile',    icon: User,             path: '/vendor/profile' },
];

const VendorSidebar = ({ mobileOpen, setMobileOpen }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = JSON.parse(sessionStorage.getItem('user') || '{}');

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const isActive = (path) =>
    path === '/vendor' ? location.pathname === '/vendor' : location.pathname.startsWith(path);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#3a2518] flex flex-col z-50
        transform transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[#5a3a28] flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white">
              Bike<span className="text-[#c9894e]">Rent</span>
            </h1>
            <p className="text-[10px] text-[#c9894e] uppercase tracking-widest font-bold mt-0.5">Vendor Portal</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Vendor Info */}
        <div className="px-6 py-5 border-b border-[#5a3a28]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#c9894e] flex items-center justify-center font-black text-white text-lg flex-shrink-0">
              {user.name?.[0]?.toUpperCase() || 'V'}
            </div>
            <div className="min-w-0">
              <p className="text-white font-black text-sm truncate">{user.name || 'Vendor'}</p>
              <p className="text-[#a07050] text-xs truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, path }) => {
            const active = isActive(path);
            return (
              <button key={path} onClick={() => { navigate(path); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group
                  ${active
                    ? 'bg-[#c9894e] text-white shadow-lg'
                    : 'text-[#c0a080] hover:bg-[#5a3a28] hover:text-white'
                  }`}>
                <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-white' : 'text-[#c9894e] group-hover:text-white'}`} />
                {label}
                {active && <ChevronRight className="h-4 w-4 ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#5a3a28]">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#c0a080] hover:bg-red-900/40 hover:text-red-400 transition-all">
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default VendorSidebar;

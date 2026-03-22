import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';
import { Shield, LayoutDashboard, Users, Bike, CheckSquare, CalendarCheck, TrendingUp, UserCog, LogOut, X } from 'lucide-react';

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);

  // Simple way to refresh count is to listen to routing changes
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await API.get(`/admin/bikes/pending?t=${new Date().getTime()}`);
        setPendingCount(res.data.length);
      } catch (err) { console.error(err); }
    };
    fetchPending();

    window.addEventListener('bikeStatusChanged', fetchPending);
    return () => window.removeEventListener('bikeStatusChanged', fetchPending);
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/login';
  };

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Manage Bikes', path: '/admin/bikes', icon: Bike },
    { name: 'Pending Approvals', path: '/admin/pending', icon: CheckSquare, badge: pendingCount },
    { name: 'Manage Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Revenue Analytics', path: '/admin/revenue', icon: TrendingUp },
    { name: 'My Profile', path: '/admin/profile', icon: UserCog },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#2a1f1a] text-white overflow-hidden">
      {/* Brand */}
      <div className="px-6 py-8 flex items-center gap-3">
        <div className="h-10 w-10 flex-shrink-0 bg-[#8b5e3c] rounded-xl flex items-center justify-center">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight">Admin<span className="text-[#8b5e3c]">Ride</span></h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Control Center</p>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-6 custom-scrollbar">
        <p className="px-3 text-[10px] font-black uppercase text-gray-500 tracking-wider mb-2 mt-2">Main Menu</p>
        {navItems.map((item) => {
          const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);
          return (
            <button
              key={item.name}
              onClick={() => { navigate(item.path); if (setMobileOpen) setMobileOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive ? 'bg-[#8b5e3c] text-white font-black shadow-lg shadow-[#8b5e3c]/20' : 'text-gray-400 font-bold hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} />
                <span className="text-sm">{item.name}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-white text-[#8b5e3c]' : 'bg-red-500 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-400 font-bold hover:bg-red-400/10 transition">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-72 h-screen fixed inset-y-0 left-0 bg-[#2a1f1a] shadow-xl z-50">
        <SidebarContent />
      </div>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 max-w-sm h-full flex flex-col z-50 transform transition-transform duration-300 bg-[#2a1f1a]">
            <button onClick={() => setMobileOpen(false)} className="absolute top-6 right-[-48px] p-2 bg-black/50 text-white rounded-full">
              <X className="h-6 w-6" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
